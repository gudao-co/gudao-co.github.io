import { Spinner } from 'flowbite-react';
import { Skill, isGrant } from 'gudao-co-core/dist/skill';
import { useEffect, useState } from 'react';
import { HiBadgeCheck, HiExclamation } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from './Logo';

function SkillIsGrant(props: {
    skill: Skill
    owner: string
}) {
    let [grant, setGrant] = useState<boolean>()
    let [loading, setLoading] = useState(true)

    const item = props.skill
    const owner = props.owner

    useEffect(() => {
        isGrant(item.id, owner).then((rs) => {
            setGrant(rs)
            setLoading(false)
        })
        return () => { }
    })

    let stateView = <></>

    if (loading || grant === undefined) {
        stateView = <Spinner size="sm" style={{ lineHeight: "100%" }} color="success"></Spinner>
    } else if(grant) {
        stateView = <HiBadgeCheck></HiBadgeCheck>
    } else {
        stateView = <HiExclamation></HiExclamation>
    }

    return (
        <li className="py-3 sm:py-4 hover:opacity-75">
            <Link className="flex items-center space-x-4" to={"/skill?id=" + item.id}>
                <span className="shrink-0">
                    <Logo addr={item!.erc721_name + '#' + item!.id} size="md"></Logo>
                </span>
                <span className="min-w-0 flex-1">
                    <p className="truncate text-lg font-medium text-gray-900 dark:text-white">
                        {item.metadata ? item.metadata.name : `${item.gist_user}/${item.gist_id}`}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {item.erc721_name}#{item.id}
                    </p>
                </span>
                <span className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white pr-2">
                    {stateView}
                </span>
            </Link>
        </li>
    );
}

export default SkillIsGrant;
