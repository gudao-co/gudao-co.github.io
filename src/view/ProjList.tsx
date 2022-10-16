import { Project } from 'gudao-co-core/dist/project';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from './Logo';

function ProjList(props: {
    items: Project[]
}) {
    return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {
                props.items.map((item) => (
                    <li className="py-3 sm:py-4 hover:opacity-75" key={item.addr}>
                        <Link className="flex items-center space-x-4" to={"/proj/" + item.addr}>
                            <span className="shrink-0">
                                <Logo addr={item.addr} size="md"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-lg font-medium text-gray-900 dark:text-white">
                                    {item.erc721_name}#{item.erc721_id}
                                </p>
                                <pre className="truncate text-sm text-gray-500 dark:text-gray-400 ">
                                    {item.addr}
                                </pre>
                            </span>
                            <span className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                                <span>{item.taskCount}</span>
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}

export default ProjList;
