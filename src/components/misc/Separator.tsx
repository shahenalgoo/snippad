/**
 * Just a separator
 * ~ used mostly in auth pages
 * 
 */

const Separator = () => {
    return (
        <div className="w-full flex item-center justify-center my-8">
            <div className="inline-block w-10 h-2 border-t border-b border-black dark:border-white opacity-10">&nbsp;</div>
        </div>
    );
}

export default Separator;