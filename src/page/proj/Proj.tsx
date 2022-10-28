import { Alert, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { getProject, Project } from 'gudao-co-core/dist/project';
import { getBalances } from 'gudao-co-core/dist/project';
import { useState } from 'react';
import { HiInformationCircle, HiOutlineChevronRight } from 'react-icons/hi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "../../i18n";
import Logo from '../../view/Logo';
import useNetwork from '../../use/useNetwork';
import useWallet from '../../use/useWallet';
import useWalletReady from '../../use/useWalletReady';
import { setWalletChooses } from '../../use/useWalletChooses';
import { CurrencyValue } from 'gudao-co-core/dist/currency';
import { nextTick } from 'process';
import Markdown from '../../view/Markdown';

enum State {
    None,
    Loading,
    Success,
    Failure
}

function Proj() {
    const { t } = useTranslation()
    const params = useParams()
    const navigate = useNavigate()
    const [state, setState] = useState<State>(State.None)
    const [errmsg, setErrmsg] = useState('')
    const [project, setProject] = useState<Project>()
    const [network,] = useNetwork()
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const [balances, setBlanances] = useState<CurrencyValue[]>()

    const id = params.id

    if (!id) {
        nextTick(() => {
            navigate('/')
        })
        return (<></>)
    }

    if (!isReady) {
        return (<></>)
    }

    if (!wallet) {
        setWalletChooses({ allowClosed: false })
        return (<></>)
    }

    if (!network) {
        return (<></>)
    }

    if (state === State.None) {
        getProject(id!).then((rs) => {
            setProject(rs)
            setState(State.Success)
        }, (reason) => {
            setErrmsg(getErrmsg(reason))
            setState(State.Failure)
        })
        setState(State.Loading)
    }


    let createTask = <></>

    if (project && wallet) {
        createTask = <Link
            to={"/task/create?proj_id=" + project!.id}
            className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {t('Create Task')}
        </Link>
    }

    let card = <></>
    let gist = <></>
    let failureAlert = <></>

    if (state === State.None || state === State.Loading) {
        card = <Card>
            <div className='flex justify-center'>
                <Spinner color="success" size="md" light={true} style={{ lineHeight: "100%" }} ></Spinner>
            </div>
        </Card>
    } else if (errmsg) {
        failureAlert =
            <div className='pt-4'>
                <Alert
                    color="failure"
                    icon={HiInformationCircle}
                >
                    <span>
                        {errmsg}
                    </span>
                </Alert>
            </div>
    } else {

        if (!balances) {
            getBalances(project!.id, network!.currencys).then((rs) => {
                setBlanances(rs)
            })
        }

        card = <Card>
            <div className="flex flex-col items-center pb-10">
                <div className="mb-3">
                    <Logo addr={project!.erc721_name + '#' + project!.id} size="lg"></Logo>
                </div>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {project!.metadata ? project!.metadata.name : `${project!.gist_user}/${project!.gist_id}`}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project!.erc721_name}#{project!.id}
                </span>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                    <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75">
                        <Link className="flex items-center space-x-4" to={'/proj/tasks?id=' + project!.id}>
                            <span className="shrink-0">
                                <Logo addr={project!.erc721_name + '#' + project!.id} size="sm"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    Task
                                </p>
                            </span>
                            <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <span>{project!.taskCount}</span>
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                    {
                        network!.currencys.map((item, index) => (
                            <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75" key={item.addr}>
                                <Link className="flex items-center space-x-4" to={"/proj/deposit?id=" + project!.id + '&currency=' + item.addr}>
                                    <span className="shrink-0">
                                        <Logo addr={item.addr} size="sm"></Logo>
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                            {item.symbol}
                                        </p>
                                    </span>
                                    <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <span>{balances ? balances[index].value : '--'}</span>
                                        <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                                    </span>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
                <div className="mt-4 flex space-x-3 lg:mt-6">
                    <Link
                        to={"/proj/deposit?id=" + project!.id}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        {t('Deposit')}
                    </Link>
                    <a
                        href={`https://gist.github.com/${project!.gist_user}/${project!.gist_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        Gist
                    </a>
                </div>
            </div>
        </Card>

        gist = <Card>
            <Markdown
                src={`https://gist.githubusercontent.com/${project!.gist_user}/${project!.gist_id}/raw/README.md`}
            />
        </Card>
    }

    return (
        <>
            <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
                <div className='flex justify-end pt-4 align-middle'>
                    <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
                        Project
                    </div>
                    {createTask}
                </div>
                {failureAlert}
                <div className='pt-4'>
                    {card}
                </div>
            </div>
            <div className="container mx-auto max-w-xs sm:max-w-7xl pt-4 sm:p-4">
                {gist}
            </div>
        </>
    );
}

export default Proj;
