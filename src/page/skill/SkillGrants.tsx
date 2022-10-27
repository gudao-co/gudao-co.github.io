import { Alert, Button, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { Page } from 'gudao-co-core/dist/page';
import { SkillGrant, querySkillGrants } from 'gudao-co-core/dist/skill';
import { useTranslation } from "../../i18n";
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWallet from '../../use/useWallet';
import { nextTick } from 'process';
import SkillGrantList from '../../view/SkillGrantList';

function SkillGrants() {

    const [items, setItems] = useState<SkillGrant[]>()
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState<Page>()
    const [errmsg, setErrmsg] = useState('')
    const [wallet,] = useWallet()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [params,] = useSearchParams()

    const skill_id = params.get('id')

    if (!skill_id) {
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

        querySkillGrants({ p: p, n: 20, skill_id: skill_id!, grant: true }).then((rs) => {
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

    let grantView = <></>

    if (wallet) {
        grantView = <Button
            onClick={() => navigate('/skill/grant?id=' + skill_id)}
        >
            {t('Grant')}
        </Button>
    }

    let nodata = <></>

    if ((!items || items.length === 0) && !loading) {
        nodata = <div className='flex text-md pt-4  text-gray-900 dark:text-gray-300 justify-center items-center'>
            {t('no data')}
        </div>
    }

    return (
        <div className="container mx-auto max-w-xs sm:max-w-xl">
            <div className='flex justify-end pt-4 align-middle'>
                <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
                    <span className="hidden sm:flex">Skill&nbsp;</span><span>Grants</span>
                </div>
                {grantView}
            </div>
            {failureAlert}

            <div className='pt-4'>
                <Card>
                    {nodata}
                    {topLoadingSpinner(true)}
                    <SkillGrantList items={items || []}></SkillGrantList>
                    {bottomLoadingSpinner(true)}
                </Card>
            </div>
        </div>
    );
}

export default SkillGrants;
