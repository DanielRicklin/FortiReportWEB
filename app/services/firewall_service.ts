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

        this.config.forEach(async (vdom, index) => {
            let interfaces = await this.getData(firewall, `/system/interface?vdom=${vdom.name}`)
            this.config[index].interface = interfaces
        })

        return this.config
    }
}