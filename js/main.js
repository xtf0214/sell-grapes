const App = {
	data() {
		return {
			amount: '',
			price: '10',
			paymentMethod: '',
			soldList: [],
		};
	},
	created() {
		const today = new Date().toLocaleDateString();
		if (localStorage.getItem(today) == null) {
			localStorage.setItem(today, JSON.stringify({
				'soldList': this.soldList
			}));
		} else {
			const tmp = JSON.parse(localStorage.getItem(today));
			this.soldList = tmp.soldList;
		}
	},
	methods: {
		saveData() {
			const today = new Date().toLocaleDateString();
			localStorage.setItem(today, JSON.stringify({
				'soldList': this.soldList
			}));
		},
		submitForm() {
			if (this.amount && this.paymentMethod) {
				const curTime = new Date().toLocaleTimeString();
				this.soldList.unshift({
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
			if (this.soldList.length > 0) {
				this.soldList.shift();
				this.saveData();
			}
		},
		clearNum() {
			this.menuItems.forEach(item => {
				item.rest = 0;
				item.sold = 0;
			});
			this.soldList.splice(0, this.soldList.length);
			const today = new Date().toLocaleDateString();
			localStorage.removeItem(today);
		},
	}
};
Vue.createApp(App).mount('#app');