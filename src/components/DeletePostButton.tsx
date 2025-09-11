// "use client"
// import { useFlash } from '@/context/FlashContext';
// import React, { useTransition } from 'react'
// import Swal from 'sweetalert2';

// const DeletePostButton = ({ post_id }: { post_id: number }) => {
//     const [isPending, startTransition] = useTransition();

//     const { showFlash } = useFlash()

//     const handleDelete = (id: number) => {
//         console.log(id);

//         startTransition(async () => {
//             try {
//                 const result = await destroy(id);
//                 if (result.success) {
//                     showFlash({ message: result.message, type: "success" });
//                 } else {
//                     showFlash({ message: result.message, type: "error" });
//                 }
//                 console.log("Post deleted:", id);
//             } catch (err) {
//                 console.error(err);
//             }
//         });
//     };
//     return (
//         <button
//             className="text-red-500 mt-2"
//             onClick={() => handleDelete(post_id)}
//             disabled={isPending}
//         >
//             {isPending ? "Deleting..." : "Delete"}
//         </button>
//     )
// }

// export default DeletePostButton