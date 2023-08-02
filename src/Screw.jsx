import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import useStore from './useStore.js'
import { DynamicTween, easeInOutCubic } from 'twon'
import { useFrame } from '@react-three/fiber'

export function Screw({ exploded })
{
    const { scene, materials, nodes } = useGLTF('/models/screw.glb')
    const [ envMapIntensity ] = useStore(state => [ state.envMapIntensity ])

    /**
     * Meshes
     */
    useEffect(() =>
    {
        scene.traverse((_child) =>
        {
            if(_child.isMesh)
            {
                _child.castShadow = true
                _child.receiveShadow = true
            }
        })
    }, [])

    /**
     * Explode animation
     */
    const [ tween ] = useState(() =>
    {
        return new DynamicTween(0, { ease: easeInOutCubic })
    })

    useEffect(() =>
    {
        if(tween)
            tween.to(exploded ? 1 : 0)
    }, [ exploded ])

    useFrame(() =>
    {
        nodes.Scene.position.z = tween.getValue() * - 3
        nodes.screw.rotation.z = - tween.getValue() * 10
    })

    /**
     * Materials
     */
    materials.screw.envMapIntensity = envMapIntensity
    
    return <>
        <primitive object={ nodes.Scene } />
    </>
}