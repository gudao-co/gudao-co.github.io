import { Alert, Card, Modal, Spinner } from 'flowbite-react';
import { connect, isAvailable, WalletConnect, WalletConnects } from 'gudao-co-core/dist/wallet';
import { useTranslation } from "../i18n";
import useWalletChooses from '../use/useWalletChooses';
import image_metamask from '../image/wallet/metamask.png';
import image_walletconnect from '../image/wallet/walletconnect.png';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { nextTick } from 'process';
import { HiInformationCircle } from 'react-icons/hi';
import { getErrmsg } from 'gudao-co-core/dist/error';

var locationKey: string = ''

function WalletChooses() {
    const { t } = useTranslation()
    const location = useLocation()
    const [walletChooses, setWalletChooses] = useWalletChooses()
    const [loadingType, setLoadingType] = useState(-1)
    const [errmsg, setErrmsg] = useState('')

    const images = [
        image_metamask,
        image_walletconnect
    ]
    const onConnect = (item: WalletConnect) => {
        if (isAvailable(item.type)) {
            setLoadingType(item.type)
            setErrmsg('')
            connect(item.type).then((rs) => {
                setLoadingType(-1)
                setWalletChooses(undefined)
            }, (reason) => {
                setErrmsg(getErrmsg(reason))
                setLoadingType(-1)
            })
        } else {
            let a = document.createElement("a")
            a.href = item.url
            a.target = "_blank"
            document.body.appendChild(a)
            a.click()
            setTimeout(() => {
                document.body.removeChild(a);
            }, 1)
        }
    }

    if (locationKey && location.key !== locationKey && walletChooses) {
        nextTick(() => {
            setWalletChooses(undefined)
            setErrmsg('')
        })
    }

    locationKey = location.key

    let failureAlert = <></>

    if (errmsg) {
        failureAlert =
            <div className='pb-4'>
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

    if (walletChooses) {
        if (walletChooses.allowClosed) {
            return (
                <Modal
                    show={true}
                    onClose={() => setWalletChooses(undefined)}
                >
                    <Modal.Header>
                        {t("Connect Wallet")}
                    </Modal.Header>
                    <Modal.Body>
                        {failureAlert}
                        {
                            WalletConnects.map((item, index) => (
                                <Card key={item.type} onClick={() => onConnect(item)} style={{ marginTop: (index > 0 ? '14px' : '0px'), minWidth: "content-fit" }}>
                                    <div className="flex items-center justify-between cursor-pointer">
                                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white cursor-pointer">
                                            {item.title}
                                        </h5>
                                        <img src={images[item.type]} className={"w-8 h-8 cursor-pointer " + (loadingType === item.type ? 'hidden' : '')} alt={item.title} />
                                        <Spinner hidden={loadingType !== item.type} size="lg" color="success" light={true}></Spinner>
                                    </div>
                                </Card>
                            ))
                        }

                    </Modal.Body>
                </Modal>
            );
        }
        return (
            <Modal
                show={true}
                onClose={() => setWalletChooses(undefined)}
            >
                <Modal.Body>
                    {failureAlert}
                    {
                        WalletConnects.map((item, index) => (
                            <Card key={item.type} onClick={() => onConnect(item)} style={{ marginTop: (index > 0 ? '14px' : '0px'), minWidth: "content-fit" }}>
                                <div className="flex items-center justify-between cursor-pointer">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white cursor-pointer">
                                        {item.title}
                                    </h5>
                                    <img src={images[item.type]} className={"w-8 h-8 cursor-pointer " + (loadingType === item.type ? 'hidden' : '')} alt={item.title} />
                                    <Spinner hidden={loadingType !== item.type} size="lg" color="success" light={true}></Spinner>
                                </div>
                            </Card>
                        ))
                    }

                </Modal.Body>
            </Modal>
        );
    }

    return <></>
}

export default WalletChooses;
