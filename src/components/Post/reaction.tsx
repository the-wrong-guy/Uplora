import React,{useState} from 'react'
import {Dialog,DialogContent, DialogTitle} from '@material-ui/core'
import {useSelector} from 'react-redux'
export default function Reaction(counter) {
    const [dailogOpen,setDialogOpen] = useState(false)
    const [scroll, setScroll] = useState('paper');
    return (
        <Dialog open={dailogOpen}  scroll={"paper"} >
            <DialogTitle>All</DialogTitle>
            <DialogContent dividers={true}>
                {counter.map((data)=>{
                    return(
                        <div>
                            <div><div>{data.userDisplayPic}</div><div>{data.by}</div></div>
                            <div>{data.emoji}</div>
                        </div>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}
