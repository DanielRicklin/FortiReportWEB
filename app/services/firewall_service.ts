import Firewall from "#models/firewall";

export default class FirewallService {
    config: Array<typeof Object> = []

    async getData(firewall: Firewall, endpoint){
        let res = []
        await fetch(`https://${firewall.ip}:${firewall.port}/api/v2/cmdb${endpoint}`, {
            method: "GET",
            redirect: "follow",
            headers: {
                Authorization: `Bearer ${firewall?.apiKey}`
            },
        })
        .then(resp => resp.json())
        .then(data => {
            res = data.results
        })
        .catch(e => console.error(e))
        return res
    }

    async getConfig(firewall: Firewall){
        let vdoms = await this.getData(firewall, '/system/vdom')
        this.config = vdoms

        return new Promise((resolve) => {
            this.config.forEach(async (vdom, index) => {
                this.config[index].interface = await this.getData(firewall, `/system/interface?vdom=${vdom.name}`)
                this.config[index].service = await this.getData(firewall, `/firewall.service/custom?vdom=${vdom.name}`)
                this.config[index].service_group = await this.getData(firewall, `/firewall.service/group?vdom=${vdom.name}`)
                this.config[index].address = await this.getData(firewall, `/firewall/address?vdom=${vdom.name}`)
                this.config[index].address_group = await this.getData(firewall, `/firewall/addrgrp?vdom=${vdom.name}`)
                this.config[index].vip = await this.getData(firewall, `/firewall/vip?vdom=${vdom.name}`)
                this.config[index].vip_group = await this.getData(firewall, `/firewall/vipgrp?vdom=${vdom.name}`)
                this.config[index].ippool = await this.getData(firewall, `/firewall/ippool?vdom=${vdom.name}`)
                this.config[index].policy = await this.getData(firewall, `/firewall/policy?vdom=${vdom.name}`)
                resolve(this.config)
            })
        })
    }
}