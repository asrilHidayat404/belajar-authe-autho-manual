
import UserCredentialCard from '@/components/profile/UserCredentialCard';
import UserInfoCard from '@/components/profile/UserInfoCard';
import UserMetaCard from '@/components/profile/UserMetaCard';
import DashboardLayout from '@/layouts/DashboardLayout';
interface OrmawaInfo {
    ormawa_name: string;
    ormawa_role: string
}

export default function Profile({ ormawaInfo }: { ormawaInfo: OrmawaInfo }) {

    return (
        <DashboardLayout>
            <div className="rounded-2xl border p-5 lg:p-6">
                <h3 className="mb-5 text-lg font-semibold lg:mb-7">Profile</h3>
                <div className="space-y-6">
                    <UserMetaCard />
                    {
                        ormawaInfo?.ormawa_name && ormawaInfo?.ormawa_role ?
                            <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
                                <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">Ormawa Information</h4>
                                <div className="flex gap-6">
                                    <span>
                                        <span className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Organisasi: </span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">{ormawaInfo.ormawa_name}</span>
                                    </span>
                                    <span>|</span>
                                    <span>
                                        <span className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Jabatan: </span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">{ormawaInfo.ormawa_role}</span>
                                    </span>
                                </div>
                            </div> : null
                    }
                    <UserInfoCard />
                    <UserCredentialCard />
                </div>
            </div>
        </DashboardLayout>
    );
}