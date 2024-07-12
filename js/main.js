const App = {
    data() {
        return {
            amount: '',
            price: '10',
            paymentMethod: '',
            salesList: [],
        };
    },
    created() {
        const today = new Date().toLocaleDateString();
        if (localStorage.getItem(today) == null) {
            localStorage.setItem(today, JSON.stringify({
                'salesList': this.salesList
            }));
            if (localStorage.getItem('dayList') == null) {
                localStorage.setItem('dayList', JSON.stringify([]));
            } else {
                let dayList = JSON.parse(localStorage.getItem('dayList'));
                dayList.push(today);
            }
        } else {
            const tmp = JSON.parse(localStorage.getItem(today));
            this.salesList = tmp.salesList;
        }
    },
    methods: {
        saveData() {
            const today = new Date().toLocaleDateString();
            localStorage.setItem(today, JSON.stringify({
                'salesList': this.salesList
            }));
        },
        submitForm() {
            if (this.amount && this.paymentMethod) {
                const curTime = new Date().toLocaleTimeString();
                this.salesList.unshift({
                    time: curTime,
                    amount: parseFloat(this.amount),
                    price: parseFloat(this.price),
                    paymentMethod: this.paymentMethod,
                });
                localStorage.setItem('paymentAmount', this.amount);
                localStorage.setItem('paymentMethod', this.paymentMethod);
                this.saveData();
            } else {
                alert('请填写所有字段');
            }
        },
        revoke() {
            if (this.salesList.length > 0) {
                this.salesList.shift();
                this.saveData();
            }
        },
        clearNum() {
            this.menuItems.forEach(item => {
                item.rest = 0;
                item.sold = 0;
            });
            this.salesList.splice(0, this.salesList.length);
            const today = new Date().toLocaleDateString();
            localStorage.removeItem(today);
        },
    }
};
Vue.createApp(App).mount('#app');