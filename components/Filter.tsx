import CustomSelect from '@/components/CustomSelect'

export default function Filter(){
    return(
        <>
            <div className="h-[10vh] w-full bg-red-900 border-y-4 border-red-700">
                <div className="flex gap-3">
                    <CustomSelect />
                </div>
            </div>
        </>
    );
}