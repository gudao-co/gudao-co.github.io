
import { getErrmsg } from 'gudao-co-core/dist/error';
import { send } from 'gudao-co-core/dist/http'
import { ReactElement, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function Markdown(props: {
    src: string
    loading?: ReactElement
    onError?: (errmsg: string) => ReactElement
}): ReactElement {

    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState<string>()
    const [errmsg, setErrmsg] = useState('')

    if (content === undefined && !loading) {
        setLoading(true)
        send('GET', props.src, undefined, undefined, 'text').then((rs) => {
            setLoading(false)
            setContent(rs as string)
        }, (reason) => {
            setLoading(false)
            setErrmsg(getErrmsg(reason))
        })
    }

    if (loading) {
        if (props.loading) {
            return props.loading
        }
        return <></>
    }

    if (errmsg) {
        if (props.onError) {
            return props.onError(errmsg)
        }
        return <></>
    }

    return <article className='prose prose-gray prose-base dark:prose-invert max-w-full'>
        <ReactMarkdown>{content || ''}</ReactMarkdown>
    </article>
}

export default Markdown;
