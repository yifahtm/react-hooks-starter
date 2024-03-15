const { useState, useEffect } = React
const { Link, Outlet } = ReactRouterDOM
const { useParams } = ReactRouter

import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState()
    const [isOnCompose, setIsOnCompose] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const params = useParams()

    useEffect(() => {
        loadMails(filterBy)
    }, [isSent,filterBy])
    // //filter by in the empty array
    function loadMails() {
        mailService
            .query()
            .then(setMails)
            .catch(err => console.log('Had issues with loading mails: ', err))
            .finally(setIsSent(false))
    }

    function getUnreadCount() {
        
    }

    function onRemoveMail(mailId) {
        mailService
            .remove(mailId)
            .then(() => {
                setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
            })
            .catch(err => {
                console.log('Has issues with removing mail', err)
            })
    }

    function onSetFilter(fieldsToUpdate) {
        setFilterBy(fieldsToUpdate)
      }
    

    function sendMail(newMail) {

        mailService
            .save(newMail)
            .then(savedMail => {
                console.log(`mail saved successfully ${savedMail.id}`)
            })
            .catch(err => {
                console.log('Had issues with saving mail: ', err)
            })
            .finally(() => setIsOnCompose(false))
            .finally(() => setIsSent(true))
        loadMails()
    }

    function onCloseCompose() {
        setIsOnCompose(false)
    }

    return (
        <section className="mail-container">
            <div className="compose">
                    {isOnCompose && (
                    < MailCompose sendMail={sendMail} onCloseCompose={onCloseCompose} />)}
                </div>
            <div className='mail-header'>
                <button className="compose-btn" onClick={() => setIsOnCompose(true)}>
                    <span className="material-symbols-outlined" >
                        edit
                    </span>
                    compose
                </button>

                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />

            </div>

            <section className="main-mail">
                <nav className="side-nav" >
                    <Link to="/mail/list">
                        <span className="material-symbols-outlined">
                            inbox
                        </span>
                    </Link>
                    <span className="material-symbols-outlined">
                        star
                    </span>
                    <span className="material-symbols-outlined">
                        send
                    </span>
                    <span className="material-symbols-outlined">
                        draft
                    </span>
                    <span className="material-symbols-outlined">
                        delete
                    </span>

                </nav>
                <Outlet />

                <div className='mail-section'>
                    {!params.mailId && <MailList mails={mails} onRemoveMail={onRemoveMail}/>}
                </div>

                


            </section>

        </section>
    )
}

