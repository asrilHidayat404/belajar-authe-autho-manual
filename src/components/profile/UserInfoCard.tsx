"use client";

import { LoaderCircle, Pen } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormEventHandler, useActionState, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { update } from '@/action/UserAction';
import { useFlash } from '@/context/FlashContext';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';


const initialState = {
    message: '',
}

export default function UserInfoCard() {
    const { loading, user } = useAuth()
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [state, formAction] = useActionState(update, null);
    const { showFlash } = useFlash();

    useEffect(() => {
        if (state) {
            showFlash({
                message: state.message,
                type: state.success ? "success" : "error"
            });
            if (state.success) {
                setDialogOpen(false);
            }
        }
    }, [state, showFlash]);
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                email: user.email || '',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender: value }));
    };

    // const handleSave: FormEventHandler = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // setIsLoading(true);
    //         const data = await formAction(formData);

    //         if (data?.success) {
    //             showFlash({ message: data?.message, type: "success" });
    //             setDialogOpen(false);
    //             // setIsLoading(false)
    //         } else {
    //             showFlash({ message: data?.message ?? "An error occurred", type: "error" });
    //         }
    //     } catch (err) {
    //         showFlash({ message: "Opps, something went wrong", type: "error" });
    //     } finally {
    //         // setIsLoading(false);
    //     }
    // };

    if (loading) return (
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800 flex justify-center">
            <LoaderCircle className="animate-spin" />
        </div>
    );

    if (error) return (
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800 text-red-500">
            Error: {error}
        </div>
    );

    const isStudent = user?.role?.role_name === "Mahasiswa";

    return (
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
                        Personal Information
                    </h4>

                    <div className={`grid ${isStudent ? 'grid-cols-2' : 'grid-cols-1'} gap-4 lg:gap-7 2xl:gap-x-32 pt-3`}>
                        <InfoField label="Full Name" value={user?.full_name} />
                        <InfoField label="Role" value={user?.role?.role_name} />
                        <InfoField label="Email address" value={user?.email} />

                        {isStudent && (
                            <>
                                <InfoField label="NIM" value={user?.nim} />
                                <InfoField label="Faculty" value={user?.faculty} />
                                <InfoField label="Field of Study" value={user?.field_of_study} />
                                <InfoField label="Class" value={user?.class} />
                                <InfoField label="Semester" value={user?.semester} />
                            </>
                        )}
                        <InfoField label="Gender" value={user?.gender} />
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" className="gap-2">
                            <Pen size={16} />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[425px] lg:w-[769px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>

                        <form action={formAction}>
                            <div className={`grid ${isStudent ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                <FormField
                                    label="Full Name"
                                    id="full_name"
                                    value={formData.full_name || ''}
                                    onChange={handleInputChange}
                                />
                                <FormField
                                    label="Email"
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                />

                                {isStudent && (
                                    <>
                                        <FormField
                                            label="NIM"
                                            id="nim"
                                            value={formData.nim || ''}
                                            onChange={handleInputChange}
                                        />
                                        <FormField
                                            label="Faculty"
                                            id="faculty"
                                            value={formData.faculty || ''}
                                            onChange={handleInputChange}
                                        />
                                        <FormField
                                            label="Field of Study"
                                            id="field_of_study"
                                            value={formData.field_of_study || ''}
                                            onChange={handleInputChange}
                                        />
                                        <FormField
                                            label="Class"
                                            id="class"
                                            value={formData.class || ''}
                                            onChange={handleInputChange}
                                        />
                                        <FormField
                                            label="Semester"
                                            id="semester"
                                            value={formData.semester || ''}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                )}

                                <div className="grid gap-3">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={handleGenderChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="laki-laki">Male</SelectItem>
                                            <SelectItem value="perempuan">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="mt-6 gap-2">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {value || "-"}
            </p>
        </div>
    );
}

function FormField({
    label,
    id,
    type = "text",
    value,
    onChange
}: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}