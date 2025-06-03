// 'use client';

// import Link from 'next/link';

// type Post = {
//   id: number;
//   title: string;
//   created_at: string;
// };

// type Props = {
//   posts: Post[];
// };

// export default function BoardList({ posts }: Props) {
//   if (!posts.length) {
//     return <p className='text-gray-500'>게시글이 없습니다.</p>;
//   }

//   return (
//     <ul className='space-y-4'>
//       {posts.map((post) => (
//         <li key={post.id} className='p-4 border rounded hover:bg-gray-50'>
//           <Link href={`/post/${post.id}`}>
//             <div className='text-lg font-semibold'>{post.title}</div>
//             <div className='text-sm text-gray-500'>
//               {new Date(post.created_at).toLocaleString()}
//             </div>
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }
