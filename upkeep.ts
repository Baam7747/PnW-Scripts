import { request, gql, GraphQLClient } from 'graphql-request'
const { baam, bank, kaurv } = require('../config.json')

function radiation(continent: string) {
    if (continent = "au") {
        return "australia"
    } else if (continent = "na") {
        return "north_america"
    } else if (continent = "sa") {
        return "south_america"
    } else if (continent = "eu") {
        return "europe"
    } else if (continent = "af") {
        return "africa"
    } else if (continent = "as") {
        return "asia"
    } else if (continent = "an") {
        return "antarctica"
    }
}

function prodBonus(imp: number, cap: number) {
    if (imp == 0) {
        return 0
    }
    else if (imp > 0) {
        let bonus = (0.5 * (imp - 1)) / (cap - 1)
        return (Math.round((bonus + 1) * 1000) / 1000)
    }
}

function convert(num: number) {
    if (num > 0) {
        return 0
    } else {
        return Math.abs(num)
    }
}

const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

async function revenueCalc() {

    const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

    const query1 = gql`
    {alliances (id: 5476, first: 50)
        {data
          {nations {
            id, vacation_mode_turns, tax_id
          }
          }}}
        `

    const data1 = await request(endpoint, query1)

    for (let i = 0; i < data1.alliances.data[0].nations.length; i++) {

        await timer(3000)

        if ((data1.alliances.data[0].nations[i].vacation_mode_turns === 0) && (data1.alliances.data[0].nations[i].tax_id == 21164)) {

            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${kaurv}`

            const query = gql`
        { nations (id: ${data1.alliances.data[0].nations[i].id}, first: 500) 
            { data 
                {
                id,
                nation_name,
                continent,
                population,
                soldiers,
                iron_works,
                bauxite_works,
                arms_stockpile,
                emergency_gasoline_reserve,
                mass_irrigation,
                international_trade_center,
                missile_launch_pad,
                nuclear_research_facility,
                iron_dome,
                vital_defense_system,
                central_intelligence_agency,
                center_for_civil_engineering,
                propaganda_bureau,
                uranium_enrichment_program,
                urban_planning,
                advanced_urban_planning,
                space_program,
                spy_satellite,
                moon_landing,
                pirate_economy,
                recycling_initiative,
                telecommunications_satellite,
                green_technologies,
                arable_land_agency,
                clinical_research_center,
                specialized_police_training_program,
                advanced_engineering_corps,
                    cities {
                        id,
                        name,
                        date,
                        infrastructure,
                        land,
                        powered,
                        oil_power,
                        wind_power,
                        coal_power,
                        nuclear_power,
                        coal_mine,
                        oil_well,
                        uranium_mine,
                        barracks,
                        farm,
                        police_station,
                        hospital,
                        recycling_center,
                        subway,
                        supermarket,
                        bank,
                        shopping_mall,
                        stadium,
                        lead_mine,
                        iron_mine,
                        bauxite_mine,
                        oil_refinery,
                        aluminum_refinery,
                        steel_mill,
                        munitions_factory,
                        factory,
                        hangar,
                        drydock,
                }}}}
            `

            const data = await request(endpoint, query)

            const radQuery = gql`
            { game_info {
                radiation {
                global,
                north_america,
                south_america,
                europe,
                africa,
                asia,
                australia,
                antarctica
                }}}
            `

            const radData = await request(endpoint, radQuery)

            const city = data.nations.data[0].cities

            let totalFoodCost = 0
            let totalCoal = 0
            let totalOil = 0
            let totalUranium = 0
            let totalLead = 0
            let totalIron = 0
            let totalBauxite = 0
            let totalGasoline = 0
            let totalMunitions = 0
            let totalSteel = 0
            let totalAluminum = 0
            let totalFood = 0
            let usedUranium = 0
            let soldiers = data.nations.data[0].soldiers
            let continent = radiation(data.nations.data[0].continent)!
            let radioactivity = radData.game_info.radiation[continent] + radData.game_info.radiation.global

            for (let i = 0; i < city.length; i++) {

                async function findRssIncome() {
                    let coalIronMod = 1
                    let bauxiteMod = 1
                    let leadMod = 1
                    let oilMod = 1
                    let uramod = 1
                    let farmMod = 1


                    if (data.nations.data[0].iron_works == true) {
                        coalIronMod = 1.36
                    }
                    if (data.nations.data[0].bauxite_works == true) {
                        bauxiteMod = 1.36
                    }
                    if (data.nations.data[0].arms_stockpile == true) {
                        leadMod = 1.34
                    }
                    if (data.nations.data[0].emergency_gasoline_reserve == true) {
                        oilMod = 2
                    }
                    if (data.nations.data[0].mass_irrigation == true) {
                        farmMod = 1.25
                    }
                    if (data.nations.data[0].uranium_enrichment_program == true) {
                        uramod = 2
                    }

                    let cityInfra = city[i].infrastructure
                    let coal = city[i].coal_mine * 3 * (await prodBonus(city[i].coal_mine, 10))!
                    let oil = city[i].oil_well * 3 * (await prodBonus(city[i].oil_well, 10))!
                    let uranium = city[i].uranium_mine * 3 * uramod * (await prodBonus(city[i].uranium_mine, 5))!
                    let lead = city[i].lead_mine * 3 * (await prodBonus(city[i].lead_mine, 10))!
                    let iron = city[i].iron_mine * 3 * (await prodBonus(city[i].iron_mine, 10))!
                    let bauxite = city[i].bauxite_mine * 3 * (await prodBonus(city[i].bauxite_mine, 10))!
                    let gasoline = city[i].oil_refinery * 6 * (await prodBonus(city[i].oil_refinery, 5))! * oilMod
                    let munitions = city[i].munitions_factory * 18 * (await prodBonus(city[i].munitions_factory, 5))! * leadMod
                    let steel = city[i].steel_mill * 9 * (await prodBonus(city[i].steel_mill, 5))! * coalIronMod
                    let aluminum = city[i].aluminum_refinery * 9 * (await prodBonus(city[i].aluminum_refinery, 5))! * bauxiteMod
                    let food = city[i].farm * city[i].land / 500 * farmMod * (await prodBonus(city[i].farm, 20))! * 12

                    var date1 = new Date(city[i].date);
                    var date2 = new Date();

                    // To calculate the time difference of two dates
                    var Difference_In_Time = date2.getTime() - date1.getTime();

                    // To calculate the no. of days between two dates
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                    let foodcost = (cityInfra*100)**2 / 125000000 + ((cityInfra*100) * (1 + Math.log(Difference_In_Days) / 15) - (cityInfra*100)) / 850

                    return ([coal, oil, uranium, lead, iron, bauxite, gasoline, munitions, steel, aluminum, food, foodcost])

                }

                let results = await findRssIncome()

                totalCoal += results[0];
                totalOil += results[1];
                totalUranium += results[2]
                totalLead += results[3]
                totalIron += results[4]
                totalBauxite += results[5]
                totalGasoline += results[6]
                totalMunitions += results[7]
                totalSteel += results[8]
                totalAluminum += results[9]
                totalFood += results[10] * (1 - (radioactivity / 1000))
                usedUranium += Math.ceil((data.nations.data[0].cities[i].infrastructure) / 1000) * 2.4
                totalFoodCost += results[11]

            }

            let coal1 = (totalCoal - (totalSteel / 3)) * 7
            let oil1 = (totalOil - (totalGasoline / 2)) * 7
            let uranium1 = (totalUranium - usedUranium) * 7
            let lead1 = (totalLead - (totalMunitions / 3)) * 7
            let iron1 = (totalIron - (totalSteel / 3)) * 7
            let bauxite1 = (totalBauxite - (totalAluminum / 3)) * 7
            let gasoline1 = totalGasoline * 7
            let munitions1 = totalMunitions * 7
            let steel1 = totalSteel * 7
            let aluminum1 = totalAluminum * 7
            let food1 = convert(totalFood - (totalFoodCost - (soldiers / 9000))) * 7

            const graphQLClient = new GraphQLClient(endpoint, {
                headers: {
                    ["X-Bot-Key"]: bank,
                    ["X-Api-Key"]: baam,
                },
            })

            const mutation = gql
                `mutation { 
                    bankWithdraw(receiver_type: 1, 
                    receiver: ${data.nations.data[0].id},
                    money: 0,
                    coal: ${convert(Math.sign(coal1) * Math.round(Math.abs(coal1) * 10) / 10)},
                    oil: ${convert(Math.sign(oil1) * Math.round(Math.abs(oil1) * 10) / 10)},
                    uranium: ${convert(Math.sign(uranium1) * Math.round(Math.abs(uranium1) * 10) / 10)},
                    lead: ${convert(Math.sign(lead1) * Math.round(Math.abs(lead1) * 10) / 10)},
                    iron: ${convert(Math.sign(iron1) * Math.round(Math.abs(iron1) * 10) / 10)},
                    bauxite: ${convert(Math.sign(bauxite1) * Math.round(Math.abs(bauxite1) * 10) / 10)},
                    gasoline: ${convert(Math.round(gasoline1 * 10) / 10)},
                    munitions: ${convert(Math.round(munitions1 * 10) / 10)},
                    steel: ${convert(Math.round(steel1 * 10) / 10)},
                    aluminum: ${convert(Math.round(aluminum1 * 10) / 10)},
                    food: ${(Math.sign(food1) * Math.round(Math.abs(food1) * 10) / 10)},
                    note: "Weekly Resource Upkeep")
                    {id, date}
                }`

            try {
                const data = await graphQLClient.request(mutation)
                console.log(data)
            } catch (error) {
                console.error(JSON.stringify(error))
                continue
            }

            // console.log(
            //     `${data.nations.data[0].nation_name},`,
            //     `Coal: ${convert(Math.sign(coal1) * Math.round(Math.abs(coal1) * 10) / 10)},`,
            //     `Oil: ${convert(Math.sign(oil1) * Math.round(Math.abs(oil1) * 10) / 10)},`,
            //     `Uranium: ${convert(Math.sign(uranium1) * Math.round(Math.abs(uranium1) * 10) / 10)},`,
            //     `Lead: ${convert(Math.sign(lead1) * Math.round(Math.abs(lead1) * 10) / 10)},`,
            //     `Iron: ${convert(Math.sign(iron1) * Math.round(Math.abs(iron1) * 10) / 10)},`,
            //     `Bauxite: ${convert(Math.sign(bauxite1) * Math.round(Math.abs(bauxite1) * 10) / 10)},`,
            //     `Gasoline: ${convert(Math.round(gasoline1 * 10) / 10)},`,
            //     `Munitions: ${convert(Math.round(munitions1 * 10) / 10)},`,
            //     `Steel: ${convert(Math.round(steel1 * 10) / 10)},`,
            //     `Aluminum: ${convert(Math.round(aluminum1 * 10) / 10)},`,
            //     `Food: ${(Math.sign(food1) * Math.round(Math.abs(food1) * 10) / 10)},`,
            // )

        }
    }
}

revenueCalc()