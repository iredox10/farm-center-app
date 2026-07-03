import { Client, Account, Databases, Storage, Users } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

/**
 * Create a fully-privileged admin client.
 * Use for server-side operations that don't require a user session
 * (e.g. creating documents on behalf of the system, managing users).
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}

/**
 * Create a session-scoped client that acts as a specific authenticated user.
 * Use for server-side operations where permission checks should apply
 * (e.g. reading a user's own orders, updating their profile).
 */
export function createSessionClient(session: string) {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSession(session);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
