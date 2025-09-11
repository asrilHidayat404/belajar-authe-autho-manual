"use client"
import { Pen } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';


export default function UserCredentialCard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch("/api/authUser");
            const result = await response.json();
            setUser(result.user);
        };

        getUser();
    }, []);



    const handleSave: FormEventHandler = (e) => {
        // Handle save logic here
        e.preventDefault();


        console.log('Saving changes...');
    };
    return (
        <>
            <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">Update Password</h4>

                        <div className="grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Current Password</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">*******</p>
                            </div>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Pen />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSave}>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            type="text"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password_confirmation">Password Confirmation</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-3">
                                    <DialogClose asChild>
                                        <Button variant="destructive">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
