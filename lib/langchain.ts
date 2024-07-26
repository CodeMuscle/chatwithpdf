import { ChatOpenAI } from '@langchain/openai'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import pineconeClient from './pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors'
import { RecordMetadata, Index } from '@pinecone-database/pinecone'
import { adminDb } from '@/firebaseAdmin'
import { auth } from '@clerk/nextjs/server'

// Initialize the OpenAI model using the API key and model name
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o'
})

export const indexName = 'papafam'

export async function generateDocs(docId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found!')
  }

  console.log('--- Fetch download URL from Firebase ---')
  const firebaseRef = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .get()

  const downloadUrl = firebaseRef.data()?.downloadUrl

  if (!downloadUrl) {
    throw new Error('Download URl not found!')
  }

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`)

  // Fetch the PDF from the specified URl
  const response = await fetch(downloadUrl)

  // Load the PDF into a PDFDocument object
  const data = await response.blob()

  // Load the PDF from the specified path
  console.log('--- Loading PDF document ---')
  const loader = new PDFLoader(data)
  const docs = await loader.load()

  // Split the document into smaller parts for easier processing
  console.log('--- Splitting the document into smaller parts... ---')
  const splitter = new RecursiveCharacterTextSplitter()

  const splitDocs = await splitter.splitDocuments(docs)
  console.log(`--- Split into ${splitDocs.length} parts ---`)

  return splitDocs
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error('No namespace value provided.')

  const { namespaces } = await index.describeIndexStats()
  return namespaces?.[namespace] != undefined
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found!')
  }

  let pineconeVectorStore

  // Generate embeddings for the split documents
  console.log('--- Generating embeddings ---')
  const embeddings = new OpenAIEmbeddings()

  const index = await pineconeClient.index(indexName)

  const namespaceAlreadyExists = await namespaceExists(index, docId)

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reusing existing embeddings... ---`
    )

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId
    })

    return pineconeVectorStore
  } else {
    const splitDocs = await generateDocs(docId);

    console.log(`--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`);

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }

  
}
