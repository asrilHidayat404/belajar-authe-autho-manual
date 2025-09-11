import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
    const generatePages = () => {
        const totalNumbers = 5; // max visible numbers excluding first & last
        const totalBlocks = totalNumbers + 2; // adding first & last

        if (lastPage <= totalBlocks) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const leftBound = Math.max(2, currentPage - 2);
        const rightBound = Math.min(lastPage - 1, currentPage + 2);

        pages.push(1); // always show first

        if (leftBound > 2) pages.push('...');

        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }

        if (rightBound < lastPage - 1) pages.push('...');

        pages.push(lastPage); // always show last

        return pages;
    };

    const pages = generatePages();

    return (
        <Pagination className="mt-2 mr-0 w-fit">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem className="cursor-pointer">
                        <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
                    </PaginationItem>
                )}

                {pages.map((page, idx) => (
                    <PaginationItem key={idx}>
                        {page === '...' ? (
                            <span className="px-2 text-gray-400">...</span>
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={() => onPageChange(Number(page))}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {currentPage < lastPage && (
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};


export default PaginationComponent;
