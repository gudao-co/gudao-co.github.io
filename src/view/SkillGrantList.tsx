import { SkillGrant } from 'gudao-co-core/dist/skill';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from './Logo';

function SkillGrantList(props: {
    items: SkillGrant[]
}) {
    return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {
                props.items.map((item) => (
                    <li className="py-3 sm:py-4 hover:opacity-75" key={item.id}>
                        <Link className="flex items-center space-x-4" to={"/skill/ungrant?id=" + item.id + "&addr=" + item.account}>
                            <span className="shrink-0">
                                <Logo addr={item.account} size="md"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-lg font-medium text-gray-900 dark:text-white">
                                    {item.account}
                                </p>
                            </span>
                            <span className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}

export default SkillGrantList;
