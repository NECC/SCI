import React from 'react'
import Image from 'next/image'

const Nucleos = (data) => {
    return (
            <a href={data.link} target="blank" className='block' >
                <Image
                    src={data.path}
                    alt={'núcleos'}
                    width={100}
                    height={100}
                    className='hover:opacity-80'
                />
            </a>
    )
}

export default Nucleos