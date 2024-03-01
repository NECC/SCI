import React from 'react'
import Image from 'next/image'

const Nucleos = (data) => {
    return (
            <a href={data.link} target="blank" className='block mt-auto mb-auto'  >
                <Image
                    src={data.path}
                    alt={'núcleos'}
                    width={110}
                    height={110}
                    className='hover:opacity-80'
                />
            </a>
    )
}

export default Nucleos