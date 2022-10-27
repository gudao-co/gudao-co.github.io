import { Alert, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { getSkill, Skill, getBalances, SkillFeeRate, getFeeRates, getFeeRate } from 'gudao-co-core/dist/skill';
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
import ReactEmbedGist from 'react-embed-gist';
import { nextTick } from 'process';

enum State {
    None,
    Loading,
    Success,
    Failure
}

function SkillPage() {
    const { t } = useTranslation()
    const params = useParams()
    const navigate = useNavigate()
    const [state, setState] = useState<State>(State.None)
    const [errmsg, setErrmsg] = useState('')
    const [skill, setSkill] = useState<Skill>()
    const [network,] = useNetwork()
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const [balances, setBlanances] = useState<CurrencyValue[]>()
    const [feeRates, setFeeRates] = useState<SkillFeeRate[]>()

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
        getSkill(id!).then((rs) => {
            setSkill(rs)
            setState(State.Success)
        }, (reason) => {
            setErrmsg(getErrmsg(reason))
            setState(State.Failure)
        })
        setState(State.Loading)
    }


    let grantButton = <></>

    if (skill && wallet) {
        grantButton = <Link
            to={"/skill/grant?id=" + skill!.id}
            className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {t('Grant')}
        </Link>
    }

    let withdrawButton = <></>

    if (skill && wallet && skill.owner.toLocaleLowerCase() === wallet.addr.toLocaleLowerCase()) {
        withdrawButton = <Link
            to={"/skill/withdraw?id=" + skill!.id}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
            {t('Withdraw')}
        </Link>
    }

    let card = <></>
    let gist = <></>
    let failureAlert = <></>
    let feeRatesView = <></>

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
            getBalances(skill!.id, network!.currencys).then((rs) => {
                setBlanances(rs)
            })
        }

        card = <Card>
            <div className="flex flex-col items-center pb-10">
                <div className="mb-3">
                    <Logo addr={skill!.erc721_name + '#' + skill!.id} size="lg"></Logo>
                </div>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {skill!.metadata ? skill!.metadata.name : `${skill!.gist_user}/${skill!.gist_id}`}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {skill!.erc721_name}#{skill!.id}
                </span>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                    <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75">
                        <Link className="flex items-center space-x-4" to={'/skill/tasks?id=' + skill!.id}>
                            <span className="shrink-0">
                                <Logo addr={skill!.erc721_name + '#' + skill!.id} size="sm"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    Task
                                </p>
                            </span>
                            <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <span>{skill!.taskCount}</span>
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                    <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75">
                        <Link className="flex items-center space-x-4" to={'/skill/grants?id=' + skill!.id}>
                            <span className="shrink-0">
                                <Logo addr={skill!.erc721_name + '#' + skill!.id} size="sm"></Logo>
                            </span>
                            <span className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    Grant
                                </p>
                            </span>
                            <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <span>{skill!.taskCount}</span>
                                <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                            </span>
                        </Link>
                    </li>
                    {
                        network!.currencys.map((item, index) => (
                            <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75" key={item.addr}>
                                <Link className="flex items-center space-x-4" to={"/skill/deposit?id=" + skill!.id + '&currency=' + item.addr}>
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
                        to={"/skill/deposit?id=" + skill!.id}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        {t('Deposit')}
                    </Link>
                    {withdrawButton}
                    <a
                        href={`https://gist.github.com/${skill!.gist_user}/${skill!.gist_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        Gist
                    </a>
                </div>
            </div>
        </Card>

        if (!feeRates && network && skill) {
            getFeeRate(skill, network.currencys).then((rs) => {
                setFeeRates(skill.feeRates!)
            })
        }

        if (skill?.owner.toLocaleLowerCase() === wallet.addr.toLocaleLowerCase()) {
            feeRatesView = <Card>
                <div className="flex flex-col items-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-left">
                        Fee Rate
                    </h5>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                        {
                            network!.currencys.map((item, index) => (
                                <li className="py-3 sm:py-4 min-w-full cursor-pointer hover:opacity-75" key={item.addr}>
                                    <Link className="flex items-center space-x-4" to={"/skill/feerate?id=" + skill!.id + '&currency=' + item.addr}>
                                        <span className="shrink-0">
                                            <Logo addr={item.addr} size="sm"></Logo>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {item.symbol}
                                            </p>
                                        </span>
                                        <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <span>{feeRates ? (feeRates[index].enabled ? feeRates[index].rate + '%' : 'OFF') : '--'}</span>
                                            <HiOutlineChevronRight className='ml-2'></HiOutlineChevronRight>
                                        </span>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Card>
        } else {
            feeRatesView = <Card>
                <div className="flex flex-col items-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-left">
                        Fee Rate
                    </h5>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                        {
                            network!.currencys.map((item, index) => (
                                <li className="py-3 sm:py-4 min-w-full" key={item.addr}>
                                    <div className="flex items-center space-x-4">
                                        <span className="shrink-0">
                                            <Logo addr={item.addr} size="sm"></Logo>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {item.symbol}
                                            </p>
                                        </span>
                                        <span className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <span>{feeRates ? (feeRates[index].enabled ? feeRates[index].rate + '%' : 'OFF') : '--'}</span>
                                        </span>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Card>
        }



        gist = <Card>
            <ReactEmbedGist
                gist={`${skill!.gist_user}/${skill!.gist_id}`}
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
                    Skill
                </div>
                {grantButton}
            </div>
            {failureAlert}
            <div className='pt-4'>
                {card}
            </div>
            <div className='pt-4'>
                {feeRatesView}
            </div>
            <div className='pt-4'>
                {gist}
            </div>
        </div>
    );
}

export default SkillPage;
