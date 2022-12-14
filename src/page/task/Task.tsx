import { Alert, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { getTask, Task, getBalances } from 'gudao-co-core/dist/task';
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

function TaskPage() {
    const { t } = useTranslation()
    const params = useParams()
    const navigate = useNavigate()
    const [state, setState] = useState<State>(State.None)
    const [errmsg, setErrmsg] = useState('')
    const [task, setTask] = useState<Task>()
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
        getTask(id!).then((rs) => {
            setTask(rs)
            setState(State.Success)
        }, (reason) => {
            setErrmsg(getErrmsg(reason))
            setState(State.Failure)
        })
        setState(State.Loading)
    }


    let newPullRequest = <></>

    if (task && wallet) {
        newPullRequest = <Link
            to={"/task/pull/create?task_id=" + task!.id}
            className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {t('New pull request')}
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
            getBalances(task!.id, network!.currencys).then((rs) => {
                setBlanances(rs)
            })
        }

        card = <Card>
            <div className="flex flex-col items-center pb-10">
                <div className="mb-3">
                    <Logo addr={task!.erc721_name + '#' + task!.id} size="lg"></Logo>
                </div>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {task!.metadata ? task!.metadata.name : `${task!.gist_user}/${task!.gist_id}`}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {task!.erc721_name}#{task!.id}
                </span>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                    <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75">
                        <Link className="flex items-center space-x-4" to={'/task/pulls?task_id=' + task!.id}>
                            <span className="shrink-0">
                                <Logo addr={task!.erc721_name + '#' + task!.id} size="sm"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    Pull Request
                                </p>
                            </span>
                            <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <span>{task!.pullRequestCount}</span>
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                    {
                        network!.currencys.map((item, index) => (
                            <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75" key={item.addr}>
                                <Link className="flex items-center space-x-4" to={"/task/deposit?id=" + task!.id + '&currency=' + item.addr}>
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
                        to={"/task/deposit?id=" + task!.id}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        {t('Deposit')}
                    </Link>
                    <a
                        href={`https://gist.github.com/${task!.gist_user}/${task!.gist_id}`}
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
                src={`https://gist.githubusercontent.com/${task!.gist_user}/${task!.gist_id}/raw/README.md`}
            />
        </Card>
    }

    return (
        <div>
            <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
                <div className='flex justify-end pt-4 align-middle'>
                    <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
                        Task
                    </div>
                    {newPullRequest}
                </div>
                {failureAlert}
                <div className='pt-4'>
                    {card}
                </div>
            </div>
            <div className="container mx-auto max-w-xs sm:max-w-7xl sm:p-4">
                {gist}
            </div>
        </div>
    );
}

export default TaskPage;
