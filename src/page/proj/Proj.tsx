import { Alert, Card, Spinner, Tooltip } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { getProject, Project } from 'gudao-co-core/dist/project';
import { getBalances } from 'gudao-co-core/dist/balance';
import { useState } from 'react';
import { HiInformationCircle, HiOutlineChevronRight } from 'react-icons/hi';
import { BiCopyAlt } from 'react-icons/bi'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "../../i18n";
import Logo from '../../view/Logo';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useNetwork from '../../use/useNetwork';
import useWallet from '../../use/useWallet';
import useWalletReady from '../../use/useWalletReady';
import { setWalletChooses } from '../../use/useWalletChooses';
import { CurrencyValue } from 'gudao-co-core/dist/currency';
import ReactEmbedGist from 'react-embed-gist';

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
    const [copyed, setCopyed] = useState(false)
    const [network,] = useNetwork()
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const [balances, setBlanances] = useState<CurrencyValue[]>()

    if (!/^0x[0-9a-fA-F]{40,40}$/i.test(params.addr!)) {
        navigate('/')
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
        getProject(params.addr!).then((rs) => {
            setProject(rs)
            setState(State.Success)
        }, (reason) => {
            setErrmsg(getErrmsg(reason))
            setState(State.Failure)
        })
        setState(State.Loading)
    }

    let withdraw = <></>

    if (project && wallet.addr.toLocaleLowerCase() === project!.owner) {
        withdraw = <Link
            to={"/proj/withdraw/" + project!.addr}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
            {t('Withdraw')}
        </Link>
    }

    let createTask = <></>

    if (project && wallet ) {
        createTask = <Link
            to={"/task/create?proj=" + project!.addr}
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
            getBalances(wallet!, project!.addr, network!.currencys).then((rs) => {
                setBlanances(rs)
            })
        }

        card = <Card>
            <div className="flex flex-col items-center pb-10">
                <div className="mb-3">
                    <Logo addr={project!.addr} size="lg"></Logo>
                </div>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {project!.erc721_name}#{project!.erc721_id}
                </h5>

                <CopyToClipboard text={project!.addr} onCopy={() => setCopyed(true)}>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex flex-row cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 flex-nowrap max-w-full items-center" >

                        <span className='truncate'>
                            {project!.addr}
                        </span>
                        <Tooltip content={copyed ? 'Copyed!' : 'Copy'} hidden={!copyed}>
                            <span className='leading-none'>
                                <BiCopyAlt className='inline-flex ml-1'></BiCopyAlt>
                            </span>
                        </Tooltip>
                    </span>
                </CopyToClipboard>

                <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                    <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75">
                        <Link className="flex items-center space-x-4" to={'/proj/tasks/' + project!.addr}>
                            <span className="shrink-0">
                                <Logo addr={project!.addr} size="sm"></Logo>
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
                                <Link className="flex items-center space-x-4" to={"/proj/deposit/" + project!.addr + '?currency=' + item.addr}>
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
                        to={"/proj/deposit/" + project!.addr}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        {t('Deposit')}
                    </Link>
                    {withdraw}
                </div>
            </div>
        </Card>

        gist = <Card>
            <ReactEmbedGist
                gist={`${project!.erc721_github}/${project!.erc721_gist}`}
                wrapperClass="gist__bash"
                loadingClass="mb-1 text-md font-medium text-gray-900 dark:text-white"
                titleClass="gist__title"
                errorClass="mb-1 text-md font-medium text-gray-900 dark:text-white"
                contentClass="gist__content"
                file="README.md"
            />
        </Card>
    }

    return (
        <div className="container mx-auto max-w-xs sm:max-w-xl">
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
            <div className='pt-4'>
                {gist}
            </div>
        </div>
    );
}

export default Proj;
