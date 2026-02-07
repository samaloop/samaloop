import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ChevronsLeft,
    ChevronsRight
} from 'react-feather';
import { Pagination } from 'semantic-ui-react';

export default function PaginationComponent({ page, pageTotal, pageChange }: any) {
    return (
        <div className='mt-4'>
            <Pagination
                onPageChange={pageChange}
                defaultActivePage={page}
                totalPages={pageTotal}
                ellipsisItem={{ content: <MoreHorizontal /> }}
                prevItem={{ content: <ChevronLeft /> }}
                nextItem={{ content: <ChevronRight /> }}
                firstItem={{ content: <ChevronsLeft /> }}
                lastItem={{ content: <ChevronsRight /> }}
                className="mx-auto d-table"
            />
        </div>
    )
}