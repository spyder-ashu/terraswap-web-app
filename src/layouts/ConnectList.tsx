/* eslint-disable react-hooks/exhaustive-deps */
import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import React, { useEffect, useState } from "react"
import { ReactNode } from "react"
import styles from "./ConnectList.module.scss"
import { useConnectModal } from "hooks"
import SupportModal from "./SupportModal"
import { useModal } from "components/Modal"
import classNames from "classnames"

declare global {
  interface Window {
    xfi: {
      terra: any
    }
    keplr: any
  }
}

const size = { width: 30, height: "auto" }
type Button = {
  label: string
  image: ReactNode
  onClick: () => void
  isInstalled?: boolean
}

const ConnectList = () => {
  //let { availableConnections, availableInstallations, connect } = useWallet()
  let { connect } = useWallet()
  let installations: any = []
  let connections: any = []

  const [buttons, setButtons] = useState<Button[]>([])

  let keplrData = {
    type: "EXTENSION",
    identifier: "keplr-wallet",
    name: "Keplr Wallet",
    url: "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en",
    icon: "https://lh3.googleusercontent.com/_-md6h0K4pTgAiYm5PBsInyxf6w0tnzBOIwWWT5UO1e3Icz21puV_EO86hPzbNLgZ2B6RuF0bAe-dctBzl2tEc2k=w128-h128-e365-rj-sc0x00ffffff",
  }

  useEffect(() => {
    if (!window.keplr) {
      installations = [{ ...keplrData }]
    } else {
      connections = [{ ...keplrData }]
    }

    makeBtns()
  }, [])

  const makeBtns = () => {
    const temp: Button[] = [
      ...connections
        .filter(({ type }: any) => type !== ConnectType.READONLY)
        .map(({ type, icon, name, identifier }: any) => {
          return {
            label: name,
            image: <img src={icon} {...size} alt={name} />,
            isInstalled: true,
            onClick: () => {
              connect(type, identifier)
              connectModal.close()
            },
          }
        }),
      ...installations
        .filter(({ type }: any) => type !== ConnectType.READONLY)
        .map(({ icon, name, url }: any) => {
          return {
            label: "Install " + name,
            image: <img src={icon} {...size} alt={name} />,
            onClick: () => {
              supportModal.setInfo(url, name)
              supportModal.open()
            },
          }
        }),
    ]
    setButtons([...temp])
  }

  const connectModal = useConnectModal()
  const supportModal = useModal()

  return (
    <article className={styles.component}>
      <SupportModal {...supportModal} />
      <section>
        {buttons &&
          Object.entries(buttons).map(
            ([key, { label, image, isInstalled, onClick }]: any) => (
              <button
                className={classNames(
                  styles.button,
                  isInstalled && styles["button--installed"]
                )}
                onClick={onClick}
                key={key}
              >
                {image}
                &nbsp;&nbsp;
                {label}
              </button>
            )
          )}
      </section>
    </article>
  )
}

export default ConnectList
