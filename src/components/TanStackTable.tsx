import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { RiArrowDownSLine, RiArrowUpSLine, RiSearch2Line, RiCloseCircleLine } from "@remixicon/react";
import { useEffect, useId, useMemo, useRef, useState, useCallback } from "react";
import { Input } from "./ui/Input";
import { router, usePage } from "@inertiajs/react";
import { FullDataProps, SharedData } from "@/types";
import { BadgeCheckIcon, Clock, Pencil, PenLineIcon, Search, XCircle } from "lucide-react";
import { DateFormatter } from "@/utils/DateFormatter";
import { RoleAction } from "@/lib/RoleAction";
import PaginationComponent from "./table/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

const statusVariants = {
    'Pending': 'default',
    'Sedang Direview': 'secondary',
    'Disetujui': 'success',
    'Ditolak': 'destructive',
    'Revisi': 'warning',
    'Sudah Direvisi': 'info'
};

const statusIcons = {
    'Disetujui': <BadgeCheckIcon className="h-4 w-4" />,
    'Ditolak': <XCircle className="h-4 w-4" />,
    'Sedang Direview': <Clock className="h-4 w-4" />,
    'Revisi': <Pencil className="h-4 w-4" />,
    'Sudah Direvisi': <PenLineIcon className="h-4 w-4" />
};

const getColumns = (reviewers?: any[], themes?: any[], categories?: any[]): ColumnDef<any>[] => [
    {
        header: "No",
        accessorKey: "id_proposal",
        cell: ({ row, table }) => {
            const pagination = table.getState().pagination;
            return (row.index + 1 + (pagination.pageIndex * pagination.pageSize)) + '.';
        },
        size: 50
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => <div className="font-medium break-words whitespace-normal">{row.original.title}</div>,
        size: 160,
        enableHiding: false
    },
    {
        header: "Theme",
        accessorKey: "theme",
        cell: ({ row }) => row.original.theme_id !== null ? row.original.theme.theme_name : "Lain-lain",
        size: 110
    },
    {
        header: "Category",
        accessorKey: "category",
        cell: ({ row }) => row.original.category_id !== null ? row.original.category.category_name : "Lain-lain",
        size: 110
    },
    {
        header: "Apllier",
        accessorKey: "user",
        cell: ({ row }) => row.original.user?.full_name ?? "-",
        size: 130
    },
    {
        header: "Ormawa",
        accessorKey: "ormawa_1d",
        cell: ({ row }) => row.original.ormawa.ormawa_name,
        size: 120
    },
    {
        header: "Date Submission",
        accessorKey: "created_at",
        cell: ({ row }) => DateFormatter(row.original.created_at),
        size: 140
    },
    {
        header: "Status",
        accessorKey: "reviewer_status",
        cell: ({ row }) => {
            const status = row.original.reviewer_status;
            return (
                <Badge variant={statusVariants[status as keyof typeof statusVariants] || 'default'}>
                    {statusIcons[status as keyof typeof statusIcons] || null}
                    {status}
                </Badge>
            );
        },
        size: 130
    },
    {
        header: "Payment Status",
        accessorKey: "payment_status",
        cell: ({ row }) => row.original.reviewer_status !== "Disetujui" ? "-" : (
            <Badge variant={row.original.payment_status ? "success" : "destructive"}>
                {row.original.payment_status ? <BadgeCheckIcon /> : <XCircle />}
                {row.original.payment_status ? "Terverifikasi" : "Belum Verifikasi"}
            </Badge>
        ),
        size: 120
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RoleAction row={row.original} reviewers={reviewers} themes={themes} categories={categories} />,
        size: 60,
        enableHiding: false
    },
];

// Custom debounce function
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

export function DataTableDemo({ data, reviewers, themes, categories, onFilterChange }: FullDataProps<any>) {
    const id = useId();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role.role_name === "Admin";

    const [searchValue, setSearchValue] = useState('');
    const [ormawaFilter, setOrmawaFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Disetujui' | 'Ditolak'>('all');

    const columns = useMemo(() => getColumns(reviewers, themes, categories), [reviewers, themes, categories]);

    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
    });

    const performSearch = useCallback((value: string) => {
        router.get(route(isAdmin ? 'admin.proposal-list.index' : 'proposal.index'), {
            search: value,
            page: 1,
        }, {
            preserveState: true,
            replace: true
        });
    }, [isAdmin]);

    const debouncedSearch = useDebounce(performSearch, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // alert(value)
        setSearchValue(value);
        debouncedSearch(value);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        table.getColumn("title")?.setFilterValue("");
        performSearch('');
    };


    // Effect untuk memberitahu parent component ketika ada filter aktif
    useEffect(() => {
        if (onFilterChange) {
            const hasFilters = searchValue !== '' || ormawaFilter !== 'all' || statusFilter !== 'all';
            onFilterChange(hasFilters);
        }
    }, [searchValue, ormawaFilter, statusFilter, onFilterChange]);
    return (
        <div className="space-y-3">
            {isAdmin && (
                <div className="bg-card rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        {/* Compact Search */}
                        <div className="relative flex-1 w-full min-w-[200px]">
                            <div className="relative">
                                <Input
                                    id={`${id}-input`}
                                    ref={inputRef}
                                    className="pl-8 pr-8 h-8 text-sm"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    placeholder="Cari..."
                                    onKeyDown={(e) => e.key === 'Enter' && performSearch(searchValue)}
                                />
                                <RiSearch2Line className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                                {searchValue && (
                                    <button
                                        className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                                        onClick={handleClearSearch}
                                    >
                                        <RiCloseCircleLine size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Compact Filters */}
                        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <Select onValueChange={(value) => {
                                setOrmawaFilter(value);
                                router.get(
                                    route('admin.proposal-list.index'),
                                    {
                                        search: searchValue,
                                        ormawa_filter: value,
                                        status_filter: statusFilter,
                                        page: 1
                                    },
                                    { preserveState: true, replace: true }
                                );

                            }}>
                                <SelectTrigger className="h-8 text-sm flex-1 w-full min-w-[180px]">
                                    <SelectValue placeholder="Filter by Ormawa" />
                                </SelectTrigger>
                                <SelectGroup>
                                    <SelectContent>
                                        <SelectLabel>ORMAWA</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="BEM">BEM</SelectItem>
                                        <SelectItem value="DPM">DPM</SelectItem>
                                        <SelectItem value="HMP">HMP</SelectItem>
                                        <SelectItem value="UKM">UKM</SelectItem>
                                    </SelectContent>
                                </SelectGroup>
                            </Select>

                            <Select
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    router.get(
                                        route('admin.proposal-list.index'),
                                        {
                                            search: searchValue,
                                            ormawa_filter: ormawaFilter,
                                            status_filter: value,
                                            page: 1
                                        },
                                        { preserveState: true, replace: true }
                                    );
                                }}
                            >
                                <SelectTrigger className="h-8 text-sm flex-1 w-full min-w-[180px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectGroup>
                                    <SelectContent>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                                    </SelectContent>
                                </SelectGroup>
                            </Select>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Compact Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table className="text-xs ">
                    <TableHeader className="bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="h-10">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: `${header.getSize()}px` }}
                                        className="px-3 py-2"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="h-9 hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-3 py-1.5 truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="px-3 py-4 text-center text-xs">
                                    {searchValue || ormawaFilter !== 'all' || statusFilter !== 'all'
                                        ? "Data tidak ditemukan"
                                        : "Belum ada data"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Compact Pagination */}
            <div className="px-2">
                <PaginationComponent
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    onPageChange={(page) => router.get(route(isAdmin ? 'admin.proposal-list.index' : 'proposal.index'), {
                        page,
                        search: searchValue
                    })}
                />
            </div>
        </div >
    );
}
