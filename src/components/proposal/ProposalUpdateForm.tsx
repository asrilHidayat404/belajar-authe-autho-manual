import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Label from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { Category, Proposal, Theme } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, X } from 'lucide-react';

function ProposalEditForm({ proposal, themes, categories }: {
    proposal: Proposal;
    themes: Theme[];
    categories: Category[];
}) {
    const [selectedProposalFile, setSelectedProposalFile] = useState<File | null>(null);
    const [selectedRabFile, setSelectedRabFile] = useState<File | null>(null);

    const { data, errors, processing, setData } = useForm<{
        id_proposal: number;
        title: string;
        theme_id: string | null; // Allow null
        category_id: string | null; // Allow null
        proposal_file: File | null;
        rab_file: File | null;
    }>({
        id_proposal: proposal?.id_proposal || 0,
        title: proposal?.title || '',
        theme_id: proposal?.theme?.id_theme ? String(proposal.theme.id_theme) : "-",
        category_id: proposal?.category?.id_category ? String(proposal.category.id_category) : "-",
        proposal_file: null,
        rab_file: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id_proposal', String(data.id_proposal));
        formData.append('title', data.title);

        // Saat mengisi formData
        if (data.theme_id && data.theme_id !== "-") {
            formData.append('theme_id', data.theme_id);
        }
        if (data.category_id && data.category_id !== "-") {
            formData.append('category_id', data.category_id);
        }

        // File handling remains the same
        if (selectedProposalFile) formData.append('proposal_file', selectedProposalFile);
        if (selectedRabFile) formData.append('rab_file', selectedRabFile);

        router.post("/edit-proposal", formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setSelectedProposalFile(null);
                setSelectedRabFile(null);
            },
            onError: (errors) => {
                console.error('Submission error:', errors);
            }
        });
    };

    const handleProposalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedProposalFile(file);
        setData('proposal_file', file);
    };

    const handleRabFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedRabFile(file);
        setData('rab_file', file);
    };

    const removeSelectedProposalFile = () => {
        setSelectedProposalFile(null);
        setData('proposal_file', null);
        // Clear file input value
        const fileInput = document.getElementById('proposal_file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const removeSelectedRabFile = () => {
        setSelectedRabFile(null);
        setData('rab_file', null);
        // Clear file input value
        const fileInput = document.getElementById('rab_file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title Field */}
            <div className="grid gap-2">
                <Label htmlFor="title">Judul Proposal*</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Edit judul proposal"
                    className={errors.title ? 'border-red-500' : ''}
                    required
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            {/* Theme Field */}
            <div className="grid gap-2">
                <Label htmlFor="theme_id">Tema*</Label>
                <Select
                    onValueChange={(value) => setData('theme_id', value)}
                    value={data.theme_id}
                    required
                >
                    <SelectTrigger className="w-full" aria-invalid={!!errors.theme_id}>
                        <SelectValue placeholder="Pilih Tema" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                        {themes.map((theme) => (
                            <SelectItem key={theme.id_theme} value={String(theme.id_theme)}>
                                {theme.theme_name}
                            </SelectItem>
                        ))}
                        <SelectItem value="-">Lain-lain</SelectItem>
                    </SelectContent>
                </Select>
                {errors.theme_id && (
                    <p className="text-sm text-red-500">{errors.theme_id}</p>
                )}
            </div>

            {/* Category Field */}
            <div className="grid gap-2">
                <Label htmlFor="category_id">Kategori*</Label>
                <Select
                    onValueChange={(value) => setData('category_id', value)}
                    value={data.category_id}
                    required
                >
                    <SelectTrigger className="w-full" aria-invalid={!!errors.category_id}>
                        <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                        {categories.map((category) => (
                            <SelectItem key={category.id_category} value={String(category.id_category)}>
                                {category.category_name}
                            </SelectItem>
                        ))}
                        <SelectItem value="-">Lain-lain</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category_id && (
                    <p className="text-sm text-red-500">{errors.category_id}</p>
                )}
            </div>

            {/* Proposal File Field */}
            <div className="grid gap-2">
                <Label htmlFor="proposal_file">File Proposal</Label>
                <div className="flex flex-col gap-2">
                    {proposal?.proposal_file_path && !selectedProposalFile && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm truncate flex-1">
                                {proposal.proposal_file_path}
                            </span>
                        </div>
                    )}
                    {selectedProposalFile && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm truncate flex-1">
                                {selectedProposalFile.name}
                            </span>
                            <button
                                type="button"
                                onClick={removeSelectedProposalFile}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <Input
                        id="proposal_file"
                        type="file"
                        accept=".pdf"
                        onChange={handleProposalFileChange}
                        className={`w-full ${errors.proposal_file ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.proposal_file}
                    />
                    {errors.proposal_file && (
                        <p className="text-sm text-red-500">{errors.proposal_file}</p>
                    )}
                </div>
            </div>

            {/* RAB File Field */}
            <div className="grid gap-2">
                <Label htmlFor="rab_file">File RAB</Label>
                <div className="flex flex-col gap-2">
                    {proposal?.rab_file_path && !selectedRabFile && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm truncate flex-1">
                                {proposal.rab_file_path}
                            </span>
                        </div>
                    )}
                    {selectedRabFile && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm truncate flex-1">
                                {selectedRabFile.name}
                            </span>
                            <button
                                type="button"
                                onClick={removeSelectedRabFile}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <Input
                        id="rab_file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleRabFileChange}
                        className={`w-full ${errors.rab_file ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.rab_file}
                    />
                    {errors.rab_file && (
                        <p className="text-sm text-red-500">{errors.rab_file}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">

                <Button
                    type="submit"
                    disabled={processing}
                    aria-disabled={processing}
                >
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                        </span>
                    ) : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}

export default ProposalEditForm;
