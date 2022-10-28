import { Alert, Button, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { Page } from 'gudao-co-core/dist/page';
import { Task, queryTasks } from 'gudao-co-core/dist/task';
import { useTranslation } from "../../i18n";
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWallet from '../../use/useWallet';
import { nextTick } from 'process';
import TaskList from '../../view/TaskList';

function ProjTasks() {

    const [items, setItems] = useState<Task[]>()
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState<Page>()
    const [errmsg, setErrmsg] = useState('')
    const [wallet,] = useWallet()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [params,] = useSearchParams()

    const proj_id = params.get('id')

    if (!proj_id) {
        nextTick(() => {
            navigate('/')
        })
        return <></>
    }

    const reloadData = (p: number) => {

        if (loading) {
            return
        }

        setLoading(true)

        queryTasks({ p: p, n: 20, proj_id: proj_id!}).then((rs) => {
            if (p === 1) {
                setItems(rs.items)
            } else {
                setItems((items || []).concat(rs.items))
            }
            setLoading(false)
            setPage(rs.page)
        }, (reason) => {
            setErrmsg(getErrmsg(reason))
            setLoading(false)
        })
    }


    if (items === undefined && !errmsg) {
        reloadData(1)
    }

    let failureAlert = <></>

    if (errmsg) {
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
    }

    let topLoadingSpinner = (light: boolean = true) => {
        return <></>
    }

    let bottomLoadingSpinner = (light: boolean = true) => {
        return <></>
    }

    if (loading) {

        if (!page || page.p === 1) {
            topLoadingSpinner = (light: boolean = true) => {
                return <div className='flex justify-center items-center mt-3'>
                    <Spinner color="success" size="md" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
                </div>
            }
        } else {
            bottomLoadingSpinner = (light: boolean = true) => {
                return <div className='flex justify-end'>
                    <Spinner color="success" size="md" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
                </div>
            }
        }
    } else if (page && page.hasMore) {
        bottomLoadingSpinner = (light: boolean = true) => {
            return <div className='flex justify-end'>
                <Button
                    color="light"
                    pill={true}
                    onClick={() => {
                        let p = page.p + 1
                        setPage({ p: p, n: page.n })
                        reloadData(p)
                    }}
                >
                    {t('load more ...')}
                </Button>
            </div>
        }
    }

    let createProject = <></>

    if (wallet) {
        createProject = <Button
            onClick={() => navigate('/proj/create')}
        >
            {t('Create Project')}
        </Button>
    }

    let nodata = <></>

    if ((!items || items.length === 0) && !loading) {
        nodata = <div className='flex text-md pt-4  text-gray-900 dark:text-gray-300 justify-center items-center'>
            {t('no data')}
        </div>
    }

    return (
        <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
            <div className='flex justify-end pt-4 align-middle'>
                <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
                    <span className="hidden sm:flex">Grants&nbsp;</span><span>Projects</span>
                </div>
                {createProject}
            </div>
            {failureAlert}

            <div className='pt-4'>
                <Card>
                    {nodata}
                    {topLoadingSpinner(true)}
                    <TaskList items={items || []}></TaskList>
                    {bottomLoadingSpinner(true)}
                </Card>
            </div>
        </div>
    );
}

export default ProjTasks;
