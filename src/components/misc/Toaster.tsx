/**
 * React Hot Toast
 * Initiated here to prevent conflicts with next 13s app router (used in layout: server component)
 * 
 */

'use client';

import { Toaster as ReactHotToast } from "react-hot-toast";

const Toaster = () => {
    return <ReactHotToast />
}

export default Toaster;