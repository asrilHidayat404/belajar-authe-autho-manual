import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { Crown, Loader2, MoreHorizontal, PlusCircle, Search, X, Check, Notebook, AlertTriangle, User, User2Icon } from "lucide-react";
import { RiMoneyCnyCircleFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from "./ui/scroll-area";
import { getProdiAcronym } from "@/utils/getProdiAcronim";
import { sortMembersByRole } from "@/utils/SortMember";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface User {
    id_user: number;
    full_name: string;
    nim: string;
    faculty: string;
    field_of_study: string;
    semester: number;
    gender: "Laki-laki" | "Perempuan";
    email?: string;
    avatar?: string;
}

interface OrmawaMember {
    id_ormawa_member: number;
    role: string;
    user: User;
}

interface Ormawa {
    id_ormawa: number;
    ormawa_name: string;
    members: OrmawaMember[];
}

interface OrmawaUserTableProps {
    ormawa: Ormawa;
    mahasiswas: User[];
}

interface LoadingStates {
    ketua: number | null;
    secretary: number | null;
    bendahara: number | null;
    dropMember: number | null;
    addMembers: boolean;
}

const roleConfig = [
    { role: 'Ketua', icon: Crown, label: 'Leader' },
    { role: 'Sekretaris', icon: Notebook, label: 'Secretary' },
    { role: 'Bendahara', icon: RiMoneyCnyCircleFill, label: 'Bendahara' }
];

export default function OrmawaUserTable({ ormawa, mahasiswas }: OrmawaUserTableProps) {
    const [open, setOpen] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDropOpen, setConfirmDropOpen] = useState(false);
    const [memberToDrop, setMemberToDrop] = useState<number | null>(null);
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        ketua: null,
        secretary: null,
        bendahara: null,
        dropMember: null,
        addMembers: false
    });
    const [genderFilter, setGenderFilter] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
    const [prodiFilter, setProdiFilter] = useState<string[]>([]);

    const availableProdi = useMemo(() =>
        Array.from(new Set(ormawa.members.map(member => member.user.field_of_study))),
        [ormawa.members]
    );

    const filteredMahasiswas = useMemo(() =>
        mahasiswas.filter(m =>
            m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !ormawa.members.some(member => member.user.id_user === m.id_user)
        ),
        [mahasiswas, searchTerm, ormawa.members]
    );

    const filteredMembers = useMemo(() => {
        return sortMembersByRole(
            ormawa.members.filter(member => {
                const genderMatch = member.user.gender === genderFilter;
                const prodiMatch = prodiFilter.length === 0 ||
                    prodiFilter.includes(member.user.field_of_study);
                return genderMatch && prodiMatch;
            })
        );
    }, [ormawa.members, genderFilter, prodiFilter]);

    const handleTambahAnggota = () => {
        if (!selectedMahasiswa.length) return;

        setLoadingStates(prev => ({ ...prev, addMembers: true }));
        router.post('/ormawa/add-members', {
            ormawa_id: ormawa.id_ormawa,
            users_id: selectedMahasiswa,
        }, {
            onSuccess: () => {
                setOpen(false);
                setSelectedMahasiswa([]);
                setSearchTerm("");
            },
            onFinish: () => setLoadingStates(prev => ({ ...prev, addMembers: false }))
        });
    };

    const toggleMahasiswa = (id: number) => {
        setSelectedMahasiswa(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAction = (
        type: keyof Omit<LoadingStates, 'addMembers'>,
        id: number,
        route: string,
        method = 'put'
    ) => {
        setLoadingStates(prev => ({ ...prev, [type]: id }));
        router[method](route, {
            onFinish: () => setLoadingStates(prev => ({ ...prev, [type]: null }))
        });
    };

    const handleDropMember = () => {
        if (!memberToDrop) return;

        setLoadingStates(prev => ({ ...prev, dropMember: memberToDrop }));
        router.delete(`/ormawa/drop-member/${memberToDrop}`, {
            onFinish: () => {
                setLoadingStates(prev => ({ ...prev, dropMember: null }));
                setConfirmDropOpen(false);
                setMemberToDrop(null);
            }
        });
    };

    const openDropConfirmation = (memberId: number) => {
        setMemberToDrop(memberId);
        setConfirmDropOpen(true);
    };

    const handleClearSearch = () => setSearchTerm("");

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setSelectedMahasiswa([]);
            setSearchTerm("");
        }
    };

    const handleProdiToggle = (prodi: string) => {
        setProdiFilter(prodi);
    };

    return (
        <div className="space-y-3">
            <Card className="border-none shadow-sm lg:w-4/5 mx-auto">
                <CardContent className="p-0">
                    <div className={`flex flex-col items-center justify-center my-4  rounded-full p-1 w-fit mx-auto ${ormawa.ormawa_name == "HMP" ? "" : "bg-accent/10 border border-accent/40"}`}>
                        <div className="flex">
                            <Button
                                onClick={() => setGenderFilter("Laki-laki")}
                                variant={genderFilter === "Laki-laki" ? "default" : "ghost"}
                                size="sm"
                                className={`rounded-full px-4 ${genderFilter === "Laki-laki"
                                    ? "shadow-sm"
                                    : "text-accent-foreground hover:bg-accent/20"
                                    }`}
                                aria-label="Filter anggota laki-laki"
                            >
                                Putra
                            </Button>
                            <span className="w-px h-5 bg-gray-300 mx-4" />
                            <Button
                                onClick={() => setGenderFilter("Perempuan")}
                                variant={genderFilter === "Perempuan" ? "default" : "ghost"}
                                size="sm"
                                className={`rounded-full px-4 ${genderFilter === "Perempuan"
                                    ? "shadow-sm"
                                    : "text-accent-foreground hover:bg-accent/20"
                                    }`}
                                aria-label="Filter anggota perempuan"
                            >
                                Putri
                            </Button>
                        </div>

                        {ormawa.ormawa_name === "HMP" && availableProdi.length > 0 && (
                            <div className="flex flex-col items-center gap-2 mt-5">
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        variant={prodiFilter.length === 0 ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-3 py-1 text-xs rounded-full"
                                        onClick={() => setProdiFilter([])}
                                    >
                                        Semua Prodi
                                    </Button>
                                    {availableProdi.map(prodi => (
                                        <Button
                                            key={prodi}
                                            variant={prodiFilter.includes(prodi) ? "default" : "outline"}
                                            size="sm"
                                            className="h-8 px-3 py-1 text-xs rounded-full"
                                            onClick={() => handleProdiToggle(prodi)}
                                        >
                                            {getProdiAcronym(prodi)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Dialog open={open} onOpenChange={handleOpenChange}>
                        <div className="flex justify-end mb-5">
                            {ormawa.members.length > 0 && (
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-1 h-8">
                                        <PlusCircle className="w-3 h-3" />
                                        <span className="text-xs">Tambah Anggota</span>
                                    </Button>
                                </DialogTrigger>
                            )}
                        </div>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle className="text-sm">Tambah Anggota Baru</DialogTitle>
                            </DialogHeader>

                            <div className="relative">
                                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Nama...."
                                    className="pl-8 h-8 text-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Cari mahasiswa"
                                />
                                {searchTerm && (
                                    <X
                                        className="absolute right-2.5 top-2 h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:opacity-75"
                                        onClick={handleClearSearch}
                                        aria-label="Bersihkan pencarian"
                                    />
                                )}
                            </div>

                            <ScrollArea className="h-64 rounded-md border">
                                {filteredMahasiswas.length > 0 ? (
                                    <div className="divide-y">
                                        {filteredMahasiswas.map(m => (
                                            <div
                                                key={m.id_user}
                                                className="flex items-center p-1.5 hover:bg-muted/50 cursor-pointer"
                                                onClick={() => toggleMahasiswa(m.id_user)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && toggleMahasiswa(m.id_user)}
                                            >
                                                <div className="flex items-center space-x-2 w-full">
                                                    <div className={`flex items-center justify-center h-3.5 w-3.5 rounded border ${selectedMahasiswa.includes(m.id_user)
                                                        ? 'bg-primary'
                                                        : 'border-muted-foreground'
                                                        }`}>
                                                        {selectedMahasiswa.includes(m.id_user) && (
                                                            <Check className="h-full w-full text-white bg-green-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{m.full_name}</p>
                                                        <p className="text-muted-foreground text-xs">{m.field_of_study}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 text-center">
                                        <p className="text-muted-foreground">
                                            {searchTerm
                                                ? "Mahasiswa tidak ditemukan"
                                                : "Tidak ada mahasiswa atau semua mahasiswa sudah bergabung"}
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                    {selectedMahasiswa.length} terpilih
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleTambahAnggota}
                                    disabled={!selectedMahasiswa.length || loadingStates.addMembers}
                                    className="h-8 text-xs"
                                >
                                    {loadingStates.addMembers ? (
                                        <>
                                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                            Menambahkan...
                                        </>
                                    ) : "Tambahkan"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={confirmDropOpen} onOpenChange={setConfirmDropOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    <span>Konfirmasi Drop Out</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-sm text-muted-foreground">
                                    Apakah Anda yakin ingin mengeluarkan anggota ini dari ormawa?
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmDropOpen(false)}
                                    disabled={loadingStates.dropMember === memberToDrop}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDropMember}
                                    disabled={loadingStates.dropMember === memberToDrop}
                                >
                                    {loadingStates.dropMember === memberToDrop ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : 'Konfirmasi Drop Out'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {filteredMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="bg-muted/50 p-4 rounded-full mb-4">
                                <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                                {ormawa.members.length === 0
                                    ? "Belum ada anggota"
                                    : "Tidak ada anggota yang sesuai filter"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {ormawa.members.length === 0
                                    ? "Tambahkan anggota baru untuk memulai"
                                    : "Coba ubah filter pencarian Anda"}
                            </p>
                            {ormawa.members.length === 0 && (
                                <Button size="sm" className="gap-1" onClick={() => handleOpenChange(true)}>
                                    <PlusCircle className="w-3 h-3" />
                                    Tambah Anggota
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table className="text-xs">
                            <TableHeader className="bg-accent">
                                <TableRow>
                                    {['No', 'NIM', 'Name', 'Faculty', 'Field of Study', 'Semester', "Gender", 'Role', 'Aksi'].map((header) => (
                                        <TableHead key={header} className={`h-8 px-3 text-left ${header === "Aksi" ? 'sr-only' : ''}`}>
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member, i) => (
                                    <TableRow key={member.id_ormawa_member}>
                                        <TableCell className="py-2 px-3">{i + 1}.</TableCell>
                                        <TableCell className="py-2 px-3 text-[9px]">{member.user.nim ?? "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Avatar className="h-6 w-6 flex-shrink-0">
                                                    <AvatarImage
                                                        src={member.user.avatar ? `/storage/${member.user.avatar}` : '/images/default-avatar.png'}
                                                        alt={member.user.full_name}
                                                        className="object-cover"
                                                    />
                                                </Avatar>
                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <p className="truncate font-medium text-foreground">
                                                        {member.user.full_name}
                                                    </p>
                                                    <p className="truncate mt-[2px] text-[8px] text-muted-foreground">
                                                        {member.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-3">{member.user.faculty ?? "-"}</TableCell>
                                        <TableCell className="py-2 px-3 whitespace-nowrap">
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <div className="cursor-pointer text-xs font-medium rounded-md transition-colors">
                                                        {getProdiAcronym(member.user.field_of_study) ?? "-"}
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="text-sm p-2 max-w-fit">
                                                    <p>{member.user.field_of_study ?? "-"}</p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </TableCell>
                                        <TableCell className="py-2 px-3">{member.user.semester ?? "-"}</TableCell>
                                        <TableCell className="py-2 px-3">{member.user.gender ?? "-"}</TableCell>
                                        <TableCell className="py-2 px-3">
                                            <div className="w-24"> {/* Container dengan lebar tetap */}
                                                {member.role === 'Ketua' ? (
                                                    <Badge variant="default" className="w-full justify-center text-[0.65rem] bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                                                        <Crown className="h-3 w-3 mr-1" />
                                                        {member.role}
                                                    </Badge>
                                                ) : member.role === 'Sekretaris' ? (
                                                    <Badge variant="default" className="w-full justify-center text-[0.65rem] bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
                                                        <Notebook className="h-3 w-3 mr-1" />
                                                        {member.role}
                                                    </Badge>
                                                ) : member.role === 'Bendahara' ? (
                                                    <Badge variant="default" className="w-full justify-center text-[0.65rem] bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
                                                        <RiMoneyCnyCircleFill className="h-3 w-3 mr-1" />
                                                        {member.role}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="w-full justify-center text-[0.65rem]">
                                                        <User2Icon />
                                                        {member.role ?? "-"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                        <span className="sr-only">Menu aksi</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="text-xs">
                                                    {roleConfig.map(({ role, icon: Icon, label }) => (
                                                        <DropdownMenuItem
                                                            key={role}
                                                            onClick={() => handleAction(
                                                                role.toLowerCase() as keyof Omit<LoadingStates, 'addMembers'>,
                                                                member.id_ormawa_member,
                                                                `/ormawa/set-${role.toLowerCase()}/${member.id_ormawa_member}`
                                                            )}
                                                            disabled={
                                                                member.role === role ||
                                                                loadingStates[role.toLowerCase() as keyof Omit<LoadingStates, 'addMembers'>] === member.id_ormawa_member
                                                            }
                                                        >
                                                            <Icon className="mr-1.5 h-3 w-3" />
                                                            Set As {label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuItem
                                                        onClick={() => openDropConfirmation(member.id_ormawa_member)}
                                                        disabled={loadingStates.dropMember === member.id_ormawa_member}
                                                        className="focus:bg-destructive"
                                                    >
                                                        <X className="mr-1.5 h-3 w-3" />
                                                        Drop Out
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
