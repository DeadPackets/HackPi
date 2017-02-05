import * as child_process from "child_process"

import * as Promise from "bluebird"


interface IWifiClient {
    mac: string;
    signal: string;
    signalMin?: string;
    signalMax?: string;

}


export default function listwifi(device: string):Promise<IWifiClient[]> {
    return new Promise<IWifiClient[]>((resolve, reject) => {
        child_process.exec('iw dev ' + device + ' station dump', function (err, stdout, stderr) {

            if (err) {
                reject(err)
            } else {

                const reallist:IWifiClient[] = []
                const list = stdout.split('\n')

                for (let i = 0; i < stdout.split('\n').length; i++) {
                    if (stdout.split('\n')[i].split('Station ').length > 1) {
                        let station:IWifiClient = { mac: stdout.split('\n')[i].split('Station ')[1].split(' ')[0],signal:'' }
                        reallist.push(station)
                    } else if (stdout.split('\n')[i].split('signal: ').length > 1) {
                        if (stdout.split('\n')[i].split('signal: ')[1].split('\t')[1].split('[').length > 1) {
                            reallist[reallist.length - 1].signal = stdout.split('\n')[i].split('signal: ')[1].split('\t')[1].split('[')[0] + 'dBm'
                            reallist[reallist.length - 1].signalMin = stdout.split('\n')[i].split('signal: ')[1].split('[')[1].split(',')[0] + ' dBm'
                            reallist[reallist.length - 1].signalMax = stdout.split('\n')[i].split('signal: ')[1].split('[')[1].split(', ')[1].split(']')[0] + ' dBm'

                        } else {
                            reallist[reallist.length - 1].signal = stdout.split('\n')[i].split('signal: ')[1].split('\t')[1]

                        }
                    }

                }
                resolve(reallist)
            }


        })

    })



}
