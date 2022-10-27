
import { getErrmsg } from 'gudao-co-core/dist/error';
import { send } from 'gudao-co-core/dist/http'
import { ReactElement, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { nextTick } from 'process';

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

    const setMermaid = (e: HTMLDivElement, text: string) => {
        const id = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const div = document.createElement('div')
        div.id = id
        e.appendChild(div)
        mermaid.render(id, text, (svg) => {
            e.innerHTML = svg;
        })
        e.removeAttribute('data-text')
    }

    const id = 'markdown-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    nextTick(() => {
        let article = document.getElementById(id)
        if (article) {
            let vs = article.getElementsByClassName("language-mermaid")
            for (let i = 0; i < vs.length; i++) {
                let v = vs[i] as HTMLDivElement
                setMermaid(v, v.getAttribute('data-text')!);
            }
        }
    })


    return <article id={id} className='prose prose-gray prose-base dark:prose-invert max-w-full'>
        <ReactMarkdown components={{
            code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                if (match && match[1] === 'mermaid') {
                    return <div className={className + ' flex justify-center items-center'} {...props} data-text={children.join('')}></div>
                } else {
                    return <code className={className} {...props}>
                        {children}
                    </code>
                }
            }
        }}>{content || ''}</ReactMarkdown>
    </article>
}

export default Markdown;
