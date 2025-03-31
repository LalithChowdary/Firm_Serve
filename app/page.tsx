export default function Home() {
  return <div>hi this is lalith</div>;
}

// // app/page.tsx
// import { PrismaClient } from "@prisma/client";
// import React from "react";

// // It's recommended to instantiate PrismaClient outside of the component
// // if you're using it in server components, to avoid creating too many instances.
// const prisma = new PrismaClient();

// export default async function Home() {
//   // Fetch data directly in the server component
//   const clients = await prisma.client.findMany();

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             {/* Add other headers if needed */}
//           </tr>
//         </thead>
//         <tbody>
//           {clients.map((cli) => (
//             <tr key={cli.client_id}>
//               <td>{cli.name}</td>
//               {/* Render other client fields as needed */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
