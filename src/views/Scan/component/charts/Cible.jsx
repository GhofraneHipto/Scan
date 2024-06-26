import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';

class Cible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        colors: ['#58A9FB', '#ED4B82'],
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: [],
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      },
      showChart: true,
    };

  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedVerticalId !== this.props.selectedVerticalId ||
      prevProps.selectedDateFrom !== this.props.selectedDateFrom ||
      prevProps.selectedDateTo !== this.props.selectedDateTo ||
      prevProps.selectedPage !== this.props.selectedPage
    ) {
      this.fetchData();
    }
  }


  async fetchData() {
    const { selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage } = this.props;

    if (selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage) {
      const token = localStorage.getItem('token');
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_ranges_gender?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        if (response.status === 404) {
          this.setState({ showChart: false });
          return;
        }

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        
        const categories = [];
        const maleSeries = [];
        const femaleSeries = [];

        data.forEach(item => {
          categories.push(item.fb_ad_range_label);
          maleSeries.push(parseInt(item.male));
          femaleSeries.push(parseInt(item.female));
        });

        this.setState({
          series: [
            { name: 'Homme', data: maleSeries },
            { name: 'Femme', data: femaleSeries },
          ],
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: categories
            }
          },
          showChart: true,
        });
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        this.setState({ showChart: false });
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.showChart ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
        ) : (
          <div>Aucune Cible fondée</div>
        )}
      </div>
    );
  }
}

export default Cible;
