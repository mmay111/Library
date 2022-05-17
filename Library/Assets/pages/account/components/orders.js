var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'long' };
var orderscomponent = Vue.component('orderscomponent', {
    template: '#orders-template',
    data() {
        return {
            show: true,
            purchases: _purchases,
            products: _products,
        }
    },
    computed: {
        GetPurchases: function () {
            var newList = [];
            this.purchases.forEach(element => {
                var product = this.products.find(f => f.CVProductID == element.PurchaseProductID);
                var createdDatetimestamp = Math.floor(element.CreatedDate.replace("/Date(", "").replace(")/", ""));
                var createdDate = new Date(createdDatetimestamp);
                var endDate = this.AddDays(createdDate, product.ValidityDay);
                var strCreatedDate = createdDate.toLocaleString('tr-TR', dateOptions);
                var strEndDate = endDate.toLocaleString('tr-TR', dateOptions);

                newList.push({ ProductName: product.ProductName, CreatedDate: strCreatedDate, EndDate: strEndDate });
            }
            );
            //const r = this.purchases.filter(({ id: PurchaseProductID }) => this.products.every(({ id: CVProductID }) => CVProductID == PurchaseProductID)).map(x => { ProductName: x.PurchaseProductID });

            //console.log(r); 

            //var newArray = this.purchases.map(function (o) {
            //    console.log(o.PurchaseProductID)
            //    const result = this.products.filter(word => word.CVProductID == o.PurchaseProductID);
            //    console.log(result);
            //    var productName = this.products.filter(f => f.CVProductID == o.PurchaseProductID)[0].PoductName;
            //    return { ProductName: o.productName, CreatedDate: o.CreatedDate }
            //}
            //);
            return newList;
        },

    },
    methods: {

        AddDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
        })
    },
    beforeDestroy() {
    },
    watch: {

    },
});