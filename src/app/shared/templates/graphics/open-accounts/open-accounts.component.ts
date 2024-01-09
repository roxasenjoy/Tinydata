import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as echarts from 'echarts';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';


interface TreeNode {
    name: string;
    value: number;
    children?: TreeNode[];
}

@Component({
    selector: 'app-open-accounts',
    templateUrl: './open-accounts.component.html',
    styleUrls: ['./open-accounts.component.css']
})
export class OpenAccountsComponent implements OnInit {

    /* Informations globales du graphique */
    canShowGraphicComponent: boolean = true;
    graphicName: string = "OPENACCOUNTS";

    isNoValue: boolean = false;
    noData: any;

    /* Données qui seront exportées */
    @Output() public openAccountsData = new EventEmitter<string>();
    @Output() public extendedData = new EventEmitter<any[]>();

    constructor(
        public eventEmitterService: EventEmitterService,
        public granularities: GranularitiesStorage,
        public dashboardService: DashboardService,
        public settingsStorageService: SettingsStorageService,
        private RequestV2Service: RequestV2Service,
        private FilterStorageService: FiltersStorageService
    ) { }

    ngOnInit(): void {
        this.getData();

        // Action effectué lors d'un changement de filtre
        this.eventEmitterService.changeFormationFilter.subscribe(() => {
            this.getData();
        })

        // Event qui vient de se passer dans le filtre
        this.eventEmitterService.refreshGraphics.subscribe((isPerfectData: boolean) => {
            this.getData();
        });

        this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
            if ("OPENACCOUNTS" in graphSelected || graphSelected.includes("OPENACCOUNTS")) {
                this.getData();
            }
        });

    }

    getData() {

        this.canShowGraphicComponent = false;

        FiltersStorageService.specificGraphData('openaccounts', {});

        this.RequestV2Service.getData('openaccounts', {}).subscribe(
            (result: any) => {

                this.canShowGraphicComponent = true;
                result = JSON.parse(result.data.graphData.data);

                /* Création des données pour le graphique */
                const data = {
                    children: [] as TreeNode[]
                } as TreeNode;

                this.convert(result.dataGraphic, data);

                if (result.dataExtendedOld.length === 0) {
                    this.isNoValue = true;
                    data.children = []; // Enlever le tableau des données vide
                } else {
                    this.isNoValue = false;
                }

                /* Création des données pour la vue détailée */
                setTimeout(() => {
                    this.getGraphic(data, Object.values(result.dataExtendedOld));
                }, 100);
            }
        )
    }

    getGraphic(data: any, extendedData: any) {

        var chartDom: any = document.getElementById('graphicComponent') as HTMLElement;
        var myChart: any = echarts.init(chartDom);
        var option;

        // Exporter les données pour le graphique
        this.openAccountsData.emit(myChart);
        this.extendedData.emit(extendedData);

        if (this.isNoValue) {
            this.noData = {
                show: true,
                left: "center",
                top: "center",
                triggerEvent: false,
                textStyle: {
                    color: '#a24bfe',
                    fontWeight: 400,
                    fontSize: 10,
                    textBorderColor: "#fada5e"
                },
                subtext: `Aucun compte ouvert`,
                subtextStyle: {
                    color: "grey",
                    fontSize: 20
                },
            }
        } else {
            this.noData = {
                show: false
            }
        }



        myChart.setOption(
            (option = {
                title: this.noData,
                // Design du hover sur tous les éléments
                tooltip: {
                    show: this.isNoValue ? false : true,
                    fontFamily: "Montserrat-Regular",
                },
                label: {
                    position: 'insideTopLeft',
                    formatter: function (params: any) {
                        let arr = [
                            '{name|' + params.name + '}',
                            '{hr|}',
                            '{label|Comptes ouverts : ' + params.value + '}'
                        ];

                        return arr.join('\n');
                    },
                    rich: {
                        household: {
                            fontSize: 14,
                            color: '#fff'
                        },
                        label: {
                            fontSize: 9,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            borderRadius: 2,
                            padding: [2, 4],
                            lineHeight: 25,
                            align: 'center',
                        },
                        name: {
                            fontSize: 12,
                            color: '#fff',
                            align: 'center',
                        },
                        hr: {
                            width: '100%',
                            borderColor: 'rgba(255,255,255,0.2)',
                            borderWidth: 0.5,
                            height: 0,
                            lineHeight: 10
                        }
                    }
                },
                series: [
                    {
                        name: 'Ouverture de comptes',
                        type: 'treemap',
                        fontFamily: "Montserrat-Regular",
                        visibleMin: 300,
                        roam: false,
                        data: data.children,
                        leafDepth: 1,
                        levels: [
                            { // Depth - 0
                                color: ['#4300f0', '#65afff', '#c48bff', '#9229ff', '#1b1725'],

                                itemStyle: {
                                    borderColor: '#FFF',
                                    borderWidth: 1,
                                    fontFamily: "Montserrat-Regular",
                                    gapWidth: 1
                                }
                            },
                        ],

                        // Fil d'ariane en bas du graphique
                        breadcrumb: {
                            show: true,
                            bottom: "10px",
                            top: "10px",
                            itemStyle: {
                                color: "#9229ff"
                            }

                        }
                    }
                ]
            })
        );

        myChart.resize();
        window.addEventListener('resize', function () {
            myChart.resize();
        });

    }

    convert(source: any, target: TreeNode) {
        source.forEach((e: any) => {
            target.children?.push(e);
        });
    }

}
