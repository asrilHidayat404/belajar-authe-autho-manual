import { Proposal, SharedData } from '@/types';
import { StoreReport, UpdateReport } from '@/wayfinder/actions/App/Http/Controllers/ReportController';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Camera, Cloud, Download, File, FileEdit, FileText, Loader2, Upload, View } from 'lucide-react';
import { FormEvent } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Label from '../ui/Label';
import { Input } from '../ui/Input';

const UploadReport = ({ proposal }: { proposal: Proposal }) => {
    const isMahasiswa = usePage<SharedData>().props.auth.user.role.role_name === "Mahasiswa";
    const { data, setData, errors, processing } = useForm<{
        report_file: File | null;
        proposal_id: number;
    }>({
        report_file: null,
        proposal_id: proposal.id_proposal,
    });

    const handleSubmitReport = (e: FormEvent) => {
        e.preventDefault();

        if (!data.report_file) {
            return;
        }

        const formData = new FormData();
        formData.append('proposal_id', data.proposal_id.toString());
        formData.append('report_file', data.report_file);

        router.post(StoreReport().url, formData, {
            onError: () => {
                // Handle error if needed
            },
        });
    };

    if (!isMahasiswa) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <Cloud className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Laporan Belum Tersedia</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Mahasiswa belum mengunggah laporan untuk kegiatan ini.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="report">Unggah Laporan</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="report"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        className="flex-1"
                        onChange={(e) => setData('report_file', e.target.files?.[0] || null)}
                    />
                    <Button type="submit" className="flex items-center gap-2" disabled={processing || !data.report_file}>
                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Unggah
                    </Button>
                </div>
                {errors.report_file && (
                    <p className="text-sm text-red-600 dark:text-red-500">{errors.report_file}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Format file: PDF, DOC, DOCX (Maksimal 10MB)
                </p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                Pastikan laporan memenuhi format yang telah ditentukan. Laporan yang tidak sesuai akan ditolak.
            </div>
        </form>
    );
};

const EditReport = ({ proposal }: { proposal: Proposal }) => {
    console.log(proposal);

    const isMahasiswa = usePage<SharedData>().props.auth.user.role.role_name === "Mahasiswa";
    const { data, setData, errors, processing, post } = useForm<{
        updated_report_file: File | null;
        proposal_id: number;
    }>({
        updated_report_file: null,
        proposal_id: proposal.id_proposal,
    });
    console.log(proposal);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.updated_report_file) return;

        post(UpdateReport().url, {
            onSuccess: () => {
                setData('updated_report_file', null);
            },
        });
    };

    return (
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Laporan Tersedia</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isMahasiswa ? "Anda sudah mengunggah laporan untuk proposal ini." : "Mahasiswa telah mengunggah laporan."}
            </p>

            <div className="mt-4 grid lg:grid-cols-3 md:grid-cols-3 place-items-center justify-center gap-3 w-full">
                <Button variant="outline" asChild>
                    <a
                        href={`/storage/reports/${proposal.report?.report_file_path}`}
                        target="_blank"
                        download={proposal.title}
                        className="flex items-center gap-2"
                    >
                        <Download />
                        Unduh Laporan
                    </a>
                </Button>
                <Button variant="link" asChild>
                    <a
                        href={`/storage/reports/${proposal.report?.report_file_path}`}
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <View className="h-4 w-4" />
                        Lihat Laporan
                    </a>
                </Button>

                {isMahasiswa && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                        <Button asChild className='w-full'>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setData('updated_report_file', e.target.files[0]);
                                        }
                                    }}
                                />
                                <FileEdit className="h-4 w-4" />
                                {data.updated_report_file ? (
                                    <span className="max-w-[120px] truncate">{data.updated_report_file.name}</span>
                                ) : (
                                    'Edit Laporan'
                                )}
                            </label>
                        </Button>

                        {data.updated_report_file && (
                            <Button
                                variant="destructive"
                                type="submit"
                                disabled={processing}
                                className='w-full'
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Perubahan'}
                            </Button>
                        )}
                    </form>
                )}
            </div>

            {errors.updated_report_file && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.updated_report_file}
                </p>
            )}
        </div>
    );
};

export const ProposalReport = ({ proposal, refValue }: { proposal: Proposal; refValue: HTMLDivElement | undefined }) => {

    const hasReport = !!proposal.report;
    console.log(proposal);

    return (
        <Card ref={refValue ? refValue : undefined} className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
                <CardTitle className="line-clamp-1 text-lg font-semibold">
                    {proposal.title || "Judul Proposal Tidak Tersedia"}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                    Ormawa: {proposal.ormawa?.ormawa_name ?? "-"}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Status Proposal:</span>
                        <Badge variant={proposal.reviewer_status ? "success" : "secondary"}>
                            {proposal.reviewer_status || 'Belum Ditinjau'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Status Laporan:</span>
                        <Badge variant={hasReport ? 'success' : 'destructive'}>
                            {hasReport ? 'Tersedia' : 'Belum Ada'}
                        </Badge>
                    </div>
                </div>
            </CardContent>

            <div className="space-y-3 px-6 pb-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="relative w-full">
                            <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Report
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                {proposal.title || "Proposal Tanpa Judul"}
                            </DialogTitle>
                            <DialogDescription>
                                {hasReport ? 'Kelola laporan kegiatan' : 'Unggah laporan kegiatan'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {hasReport ? (
                                <EditReport proposal={proposal} />
                            ) : (
                                <UploadReport proposal={proposal} />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Button asChild variant="outline" className="w-full p-2">
                    <Link
                        href={`/dashboard/documentation/${proposal.title}`}
                        className="flex items-center gap-2"
                    >
                        <Camera />
                        Lihat Dokumentasi Kegiatan
                    </Link>
                </Button>
            </div>
        </Card>
    );
};
