import { Badge, Button, Spinner, TextInput, Toast } from 'flowbite-react';
import { getSkill, Skill } from 'gudao-co-core/dist/skill';
import { getPreSkills } from 'gudao-co-core/dist/task';
import { getFeeRates, getFeeRate } from 'gudao-co-core/dist/skill';
import { useState } from 'react';
import Logo from './Logo';
import useNetwork from '../use/useNetwork';
import { GrFormAdd } from 'react-icons/gr'
import { HiExclamation } from 'react-icons/hi';
import { showToast } from '../use/useToast';
import { getErrmsg } from 'gudao-co-core/dist/error';

function SKillChooses(props: {
    items: Skill[]
    onChange?: (items: Skill[]) => void
}) {

    const [preSkills, setPreSkills] = useState<Skill[]>()
    const [skills, setSkills] = useState<Skill[]>(props.items)
    const [network,] = useNetwork()
    const [inputSkill, setInputSkill] = useState('')
    const [loading, setLoading] = useState(false)

    if (preSkills === undefined && !loading) {
        setLoading(true)
        getPreSkills().then((rs) => {
            if (rs) {
                setPreSkills(rs)
                if (network) {
                    getFeeRates(rs, network.currencys).then((rs) => {
                        setPreSkills(rs)
                    })
                }
            }
            setLoading(false)
        })
    }


    const addSkill = (text: string) => {
        if (!network) {
            return
        }
        if (loading) {
            return
        }
        const vs = /^GUDAO\.CO\/SKILL\#([0-9]+)$/i.exec(text)
        if (vs) {

            const id = vs[1]

            if (preSkills) {
                for (let v of preSkills) {
                    if (v.id === id) {
                        showToast({
                            body: `${text} already exists`,
                            icon: <HiExclamation></HiExclamation>,
                            duration: 1600
                        })
                        return
                    }
                }
            }

            for (let v of skills) {
                if (v.id === id) {
                    showToast({
                        body: `${text} already exists`,
                        icon: <HiExclamation></HiExclamation>,
                        duration: 1600
                    })
                    return
                }
            }

            setLoading(true)
            getSkill(vs[1]).then((rs) => {
                getFeeRate(rs, network.currencys).then((rs) => {
                    let vs = skills.concat([rs])
                    setSkills(vs)
                    setLoading(false)
                    setInputSkill('')
                    if(props.onChange) {
                        props.onChange(vs)
                    }
                }, (reason) => {
                    let vs = skills.concat([rs])
                    setSkills(vs)
                    setLoading(false)
                    setInputSkill('')
                    showToast({
                        body: getErrmsg(reason),
                        icon: <HiExclamation></HiExclamation>,
                        duration: 1600
                    })
                    if(props.onChange) {
                        props.onChange(vs)
                    }
                })
            }, (reason) => {
                setLoading(false)
                showToast({
                    body: getErrmsg(reason),
                    icon: <HiExclamation></HiExclamation>,
                    duration: 1600
                })
            })
        }
    }

    const delSkill = (index: number) => {
        let vs = skills.slice(0, index).concat(skills.slice(index + 1))
        setSkills(vs)
        if(props.onChange) {
            props.onChange(vs)
        }
    }

    let loadingView = <></>

    if (loading) {
        loadingView = <div className='flex flex-row justify-center items-center p-4'>
            <Spinner size="sm" color="success"></Spinner>
        </div>
    }


    return (
        <div>
            <TextInput
                type="text"
                placeholder="GUDAO.CO/SKILL#1"
                onChange={(e) => { setInputSkill(e.currentTarget.value) }}
                onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                        e.preventDefault()
                        addSkill(inputSkill)
                        return false
                    }
                }}
                value={inputSkill}
                disabled={loading}
                icon={GrFormAdd}
            />
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-4">
                {
                    (preSkills || []).map((item) => (
                        <li className="py-3 sm:py-4" key={item.id}>
                            <div className="flex items-center space-x-4" >
                                <div className="shrink-0">
                                    <Logo addr={item!.erc721_name + '#' + item!.id} size="md"></Logo>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-lg font-medium text-gray-900 dark:text-white">
                                        {item.metadata ? item.metadata.name : `${item.gist_user}/${item.gist_id}`}
                                    </div>
                                    <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-wrap gap-2">
                                            <div>{item.erc721_name}#{item.id}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    (item.feeRates || []).filter((item)=>{
                                                        return item.enabled
                                                    }).map((feeRate) => (
                                                        <Badge key={feeRate.currency.addr}>{feeRate.rate}% {feeRate.currency.symbol}</Badge>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">

                                </div>
                            </div>
                        </li>
                    ))
                }
                {
                    skills.map((item, index) => (
                        <li className="py-3 sm:py-4" key={item.id}>
                            <div className="flex items-center space-x-4" >
                                <div className="shrink-0">
                                    <Logo addr={item!.erc721_name + '#' + item!.id} size="md"></Logo>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-lg font-medium text-gray-900 dark:text-white">
                                        {item.metadata ? item.metadata.name : `${item.gist_user}/${item.gist_id}`}
                                    </div>
                                    <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                        {item.erc721_name}#{item.id}
                                    </div>
                                </div>
                                <div className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white cursor-pointer" >
                                    <Button size="sm" color="gray" onClick={() => { delSkill(index) }}>Remove</Button>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
            {loadingView}
        </div>
    );
}

export default SKillChooses;
