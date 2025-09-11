// export type UserData = {
//     no: string;
//     avatar: string;
//     title: string;
// };

// import { Badge } from '@/components/ui/badge';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { CameraIcon, File, MoreVertical, Pen, VerifiedIcon } from 'lucide-react';

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Category, Documentation, FullDataProps, Proposal, SharedData, Theme, User } from '@/types';
// import { DateFormatter } from '@/utils/DateFormatter';
// import { router, usePage } from '@inertiajs/react';
// import { useState } from 'react';
// import { ExampleRabTable } from './RABTable';
// import { Button } from './ui/button';
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Input } from './ui/Input';
// import Label from './ui/Label';
// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from './ui/pagination';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

// const RoleAction = ({ row, reviewers, dataRab }: { row: Proposal; reviewers: User[] | unknown }) => {

//     const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);

//     const { role_name } = usePage<SharedData>().props.auth.user.role;
//     const [rabDialogOpen, setRabDialogOpen] = useState(false);
//     const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
//     const isDisetujui = row.reviewer_status === 'Disetujui';
//     const isDitolak = row.reviewer_status === 'Ditolak';
//     const isDireview = row.reviewer_status === 'Sedang Direview';

//     const isAdmin = role_name === 'Admin';
//     const isReviewer = role_name === 'Reviewer';
//     const isKeuangan = role_name === 'Keuangan';
//     const [selectedReviewer, setSelectedReviewer] = useState<{ proposalId: number | null; reviewerId: number | null } | null>();
//     const [newProposalStatus, setNewProposalStatus] = useState<{ proposalId: number | null; newStatus: string | null } | null>();

//     const saveReviewer = (e: { preventDefault: () => void }) => {
//         e.preventDefault();
//         console.log(selectedReviewer);

//         if (!selectedReviewer || selectedReviewer.proposalId === 0 || selectedReviewer.reviewerId === 0) {
//             alert('Reviewer belum dipilih!');
//             return;
//         }

//         router.post('/set-reviewer', {
//             reviewer_id: selectedReviewer.reviewerId,
//             proposal_id: selectedReviewer.proposalId,
//         });
//     };

//     const saveProposalStatus = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!newProposalStatus || newProposalStatus.proposalId === 0 || !newProposalStatus.newStatus) {
//             alert('Status proposal belum dipilih!');
//             return;
//         }
//         router.post('/proposals/review', {
//             proposal_id: newProposalStatus?.proposalId,
//             reviewer_status: newProposalStatus?.newStatus,
//             reviewer_note: (e.currentTarget.elements[0] as HTMLTextAreaElement).value, // Ambil nilai dari textarea pertama
//         });
//     };

//     const savePaymentStatus = (id: number) => {
//         if (!id) return;
//         router.post('/payment-status-update', {
//             proposal_id: id,
//         });
//     };


//     return (
//         <>
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <button className="rounded p-2 hover:bg-gray-100">
//                         <MoreVertical className="h-5 w-5" />
//                     </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-44">
//                     <DropdownMenuItem
//                         onClick={() => {
//                             setSelectedProposal(row);
//                             // setFileDialogOpen(true);
//                             setProposalDialogOpen(true);
//                         }}
//                     >
//                         <File className="mr-2 h-4 w-4" />
//                         Lihat Proposal
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                         onClick={() => {
//                             setSelectedProposal(row);
//                             // setFileDialogOpen(true);
//                             setRabDialogOpen(true);
//                         }}
//                     >
//                         <File className="mr-2 h-4 w-4" />
//                         Lihat RAB
//                     </DropdownMenuItem>

//                     {!isDisetujui && !isDitolak && !isDireview && (
//                         <DropdownMenuItem
//                             onClick={() => {
//                                 setSelectedProposal(row);
//                                 setEditDialogOpen(true);
//                             }}
//                         >
//                             <Pen className="mr-2 h-4 w-4" /> Edit Proposal
//                         </DropdownMenuItem>
//                     )}

//                     {isDisetujui && !isKeuangan && (
//                         <DropdownMenuItem asChild>
//                             <a href="#" className="flex items-center">
//                                 <CameraIcon className="mr-2 h-4 w-4" /> Dokumentasi
//                             </a>
//                         </DropdownMenuItem>
//                     )}

//                     {isAdmin && !isDisetujui && !isDitolak && !isDireview && (
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <DropdownMenuItem
//                                     onSelect={(e) => {
//                                         e.preventDefault(); // ❗ cegah dropdown menutup sebelum Dialog terbuka
//                                         // setReviewerDialogOpen(true);
//                                         setSelectedProposal(row);
//                                         // setSelectedReviewer(row.reviewer_id);
//                                     }}
//                                 >
//                                     <CameraIcon className="mr-2 h-4 w-4" />
//                                     Set Reviewer
//                                 </DropdownMenuItem>
//                             </DialogTrigger>

//                             <DialogContent>
//                                 <DialogHeader>
//                                     <DialogTitle>Set Reviewer</DialogTitle>
//                                     <DialogDescription>Pilih reviewer yang akan ditugaskan untuk proposal ini.</DialogDescription>
//                                 </DialogHeader>

//                                 <form className="space-y-4" onSubmit={saveReviewer}>
//                                     <Select
//                                         onValueChange={(val) => {
//                                             console.log(val);
//                                             if (!val) {
//                                                 return;
//                                             }
//                                             setSelectedReviewer({
//                                                 proposalId: selectedProposal?.id_proposal || 0,
//                                                 reviewerId: parseInt(val),
//                                             });
//                                         }}
//                                     >
//                                         <SelectTrigger className="w-full">
//                                             <SelectValue placeholder="Select a Reviewer" />
//                                         </SelectTrigger>
//                                         <SelectContent className="z-[9999] w-full">
//                                             <SelectGroup>
//                                                 <SelectLabel>Reviewers</SelectLabel>
//                                                 {reviewers?.map((reviewer: User) => (
//                                                     <SelectItem key={reviewer.id_user} value={reviewer.id_user.toString()}>
//                                                         {reviewer.full_name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>

//                                     <DialogFooter>
//                                         <DialogClose asChild>
//                                             <Button variant="outline">Cancel</Button>
//                                         </DialogClose>
//                                         <Button type="submit">Set Reviewer</Button>
//                                     </DialogFooter>
//                                 </form>
//                             </DialogContent>
//                         </Dialog>
//                     )}
//                     {isReviewer && (
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <DropdownMenuItem
//                                     onSelect={(e) => {
//                                         e.preventDefault(); // ❗ cegah dropdown menutup sebelum Dialog terbuka
//                                         // setReviewerDialogOpen(true);
//                                         setSelectedProposal(row);
//                                         // setSelectedReviewer(row.reviewer_id);
//                                     }}
//                                 >
//                                     <CameraIcon className="mr-2 h-4 w-4" />
//                                     Set Status Proposal
//                                 </DropdownMenuItem>
//                             </DialogTrigger>

//                             <DialogContent>
//                                 <DialogHeader>
//                                     <DialogTitle>Set Status</DialogTitle>
//                                     <DialogDescription>Pilih Status untuk proposal ini</DialogDescription>
//                                 </DialogHeader>

//                                 <form className="space-y-4" onSubmit={saveProposalStatus}>
//                                     <textarea className="min-h-10 w-full" placeholder="Catatan" />
//                                     <Select
//                                         onValueChange={(val) => {
//                                             console.log(val);
//                                             if (!val) {
//                                                 return;
//                                             }
//                                             setNewProposalStatus({
//                                                 proposalId: selectedProposal?.id_proposal || 0,
//                                                 newStatus: val,
//                                             });
//                                         }}
//                                     >
//                                         <SelectTrigger className="w-full">
//                                             <SelectValue placeholder="Select Status" />
//                                         </SelectTrigger>
//                                         <SelectContent className="z-[9999] w-full">
//                                             <SelectGroup>
//                                                 <SelectLabel>Status</SelectLabel>
//                                                 <SelectContent className="z-[9999]">
//                                                     <SelectItem value="Disetujui">Disetujui</SelectItem>
//                                                     <SelectItem value="Ditolak">Ditolak</SelectItem>
//                                                     <SelectItem value="Revisi">Revisi</SelectItem>
//                                                 </SelectContent>
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>

//                                     <DialogFooter>
//                                         <DialogClose asChild>
//                                             <Button variant="outline">Cancel</Button>
//                                         </DialogClose>
//                                         <Button type="submit">Set Reviewer</Button>
//                                     </DialogFooter>
//                                 </form>
//                             </DialogContent>
//                         </Dialog>
//                     )}
//                     {isKeuangan && (
//                         <DropdownMenuItem onClick={() => savePaymentStatus(row.id_proposal)}>
//                             <VerifiedIcon className="mr-2 h-4 w-4" /> Save
//                         </DropdownMenuItem>
//                     )}
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             {/* FILE DIALOG */}
//             <Dialog open={proposalDialogOpen} onOpenChange={setProposalDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>View Proposal</DialogTitle>
//                     </DialogHeader>
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={rabDialogOpen} onOpenChange={setRabDialogOpen}>
//                 <DialogContent className="max-w-4xl">
//                     <DialogHeader>
//                         <DialogTitle>RAB - {selectedProposal?.title}</DialogTitle>
//                     </DialogHeader>
//                     <div className="max-h-[80vh] overflow-y-auto">
//                         {selectedProposal && (
//                             <ExampleRabTable
//                                 data={dataRab?.find((item: any) => item.proposal.id_proposal === selectedProposal.id_proposal)?.rab_data || []}
//                             />
//                         )}
//                     </div>
//                     <Button onClick={() => (window.location.href = `/storage/rab/${row.rab_file_path}`)}>Download RAB</Button>
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Edit Proposal</DialogTitle>
//                     </DialogHeader>
//                     <div className="grid gap-4">
//                         <div className="grid gap-3">
//                             <Label htmlFor="title">Judul Proposal</Label>
//                             <Input id="title" defaultValue={selectedProposal?.title} placeholder="Edit judul proposal" />
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <DialogClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </DialogClose>
//                         <Button type="submit">Save changes</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export function DataTableDemo({ data, reviewer }: { data: FullDataProps<unknown>; reviewer?: unknown; dataRab?: unknown[] }) {
//     const proposals = data?.data;


//     return (
//         <>
//             <main className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>No</TableHead>
//                             <TableHead>Judul</TableHead>
//                             <TableHead>Tema</TableHead>
//                             <TableHead>Kategori</TableHead>
//                             <TableHead>Pen-Jab</TableHead>
//                             <TableHead>Tanngal</TableHead>
//                             <TableHead>status</TableHead>
//                             <TableHead>Payment Status</TableHead>
//                             <TableHead>Aksi</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {proposals.length ? (
//                             proposals.map((data: Proposal, i: number) => {
//                                 const row = data.proposal;
//                                 const dataRab = data.rab_data;

//                                 let currentStatus;
//                                 switch (row.reviewer_status) {
//                                     case 'Pending':
//                                         currentStatus = (
//                                             <Badge className="min-w-2/3" variant="default">
//                                                 {row.reviewer_status}
//                                             </Badge>
//                                         );
//                                         break;
//                                     case 'Sedang Direview':
//                                         currentStatus = (
//                                             <Badge className="min-w-2/3" variant="secondary">
//                                                 {row.reviewer_status}
//                                             </Badge>
//                                         );
//                                         break;
//                                     case 'Disetujui':
//                                         currentStatus = (
//                                             <Badge className="min-w-2/3" variant="success">
//                                                 {row.reviewer_status}
//                                             </Badge>
//                                         );
//                                         break;
//                                     case 'Ditolak':
//                                         currentStatus = (
//                                             <Badge className="min-w-2/3" variant="destructive">
//                                                 {row.reviewer_status}
//                                             </Badge>
//                                         );
//                                         break;
//                                     case 'Revisi':
//                                         currentStatus = (
//                                             <Badge className="min-w-2/3" variant="warning">
//                                                 {row.reviewer_status}
//                                             </Badge>
//                                         );
//                                         break;
//                                     default:
//                                         break;
//                                 }
//                                 return (
//                                     <TableRow key={i}>
//                                         <TableCell className="text-center">{i + 1}.</TableCell>
//                                         <TableCell>{row.title}</TableCell>
//                                         <TableCell>{row.theme.theme_name}</TableCell>
//                                         <TableCell>{row.category.category_name}</TableCell>
//                                         <TableCell>{row.user.full_name}</TableCell>
//                                         <TableCell>{DateFormatter(row.created_at)}</TableCell>
//                                         <TableCell>{currentStatus}</TableCell>

//                                         <TableHead>
//                                             {row.payment_status ? (
//                                                 <Badge className="min-w-2/3" variant="success">
//                                                     Verrified
//                                                 </Badge>
//                                             ) : (
//                                                 <Badge className="min-w-2/3" variant="destructive">
//                                                     Unverified
//                                                 </Badge>
//                                             )}
//                                         </TableHead>

//                                         <TableCell>
//                                             <RoleAction row={row} reviewers={reviewer} dataRab={proposals} />
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })
//                         ) : (
//                             <TableRow>
//                                 <TableCell className="h-24 text-center">No results.</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </main>
//             <Pagination className="mt-2 mr-0 w-fit">
//                 <PaginationContent>
//                     {/* Previous */}
//                     {data.links[0].url && (
//                         <PaginationItem>
//                             <PaginationPrevious href={data.links[0].url} />
//                         </PaginationItem>
//                     )}

//                     {/* Numbered Page Links */}
//                     {(() => {
//                         const pageLinks = data.links.slice(1, -1); // Hapus prev dan next
//                         const currentIndex = pageLinks.findIndex((l) => l.active);
//                         const maxVisible = 3;
//                         const half = Math.floor(maxVisible / 2);

//                         let start = Math.max(currentIndex - half, 0);
//                         const end = Math.min(start + maxVisible, pageLinks.length);

//                         // Adjust start if we're near the end
//                         if (end - start < maxVisible && start > 0) {
//                             start = Math.max(end - maxVisible, 0);
//                         }

//                         const sliced = pageLinks.slice(start, end);

//                         return (
//                             <>
//                                 {/* Ellipsis before */}
//                                 {start > 0 && (
//                                     <PaginationItem>
//                                         <PaginationEllipsis />
//                                     </PaginationItem>
//                                 )}

//                                 {sliced.map((link, i) => (
//                                     <PaginationItem key={i}>
//                                         <PaginationLink
//                                             href={link.url ?? '#'}
//                                             isActive={link.active}
//                                             dangerouslySetInnerHTML={{ __html: link.label }}
//                                         />
//                                     </PaginationItem>
//                                 ))}

//                                 {/* Ellipsis after */}
//                                 {end < pageLinks.length && (
//                                     <PaginationItem>
//                                         <PaginationEllipsis />
//                                     </PaginationItem>
//                                 )}
//                             </>
//                         );
//                     })()}

//                     {/* Next */}
//                     {data.links[data.links.length - 1].url && (
//                         <PaginationItem>
//                             <PaginationNext href={data.links[data.links.length - 1].url} />
//                         </PaginationItem>
//                     )}
//                 </PaginationContent>
//             </Pagination>
//         </>
//     );
// }





