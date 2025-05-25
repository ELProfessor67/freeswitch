import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import React from 'react'

const DTMFKeyboard = ({ open, onOpenChange, handleSendDTMF,dtmf,setdtmf }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <div className="h-full w-full flex flex-col justify-end">
                    <input className="bg-none border-none text-2xl mb-5 text-black outline-none" value={dtmf} onChange={(e) => setdtmf(e.target.value)} />
                    <div className="grid grid-cols-3 gap-2">
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('1')}>1</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('2')}>2</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('3')}>3</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('4')}>4</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('5')}>5</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('6')}>6</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('7')}>7</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('8')}>8</button>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('9')}>9</button>
                        <span></span>
                        <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleSendDTMF('0')}>0</button>
                        <span></span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DTMFKeyboard