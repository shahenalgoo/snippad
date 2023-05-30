'use client';

import { useUser } from '@/context/SessionContext';

const Tests = () => {

    const { user } = useUser();



    return (
        <div>
            Enter
        </div>
    );
}



export default Tests;