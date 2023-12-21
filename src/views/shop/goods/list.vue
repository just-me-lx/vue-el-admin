<template>
	<div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane :label="tab.name" v-for="(tab, tabI) in tabbars" :key="tabI">
				<button-search ref="buttonSearch" placeholder="要搜索的商品名称" @search="searchEvent">
					<template #left>
						<router-link :to="{ name: 'shop_goods_create' }">
							<el-button type="success" size="mini">发布商品</el-button>
						</router-link>

						<el-button type="warning" size="mini">恢复商品</el-button>
						<el-button type="danger" size="mini">批量删除</el-button>
						<el-button size="mini">下架</el-button>
						<el-button size="mini">上架</el-button>
					</template>
					<!-- 高级搜索表单 -->
					<template #form>
						<el-form inline ref="form" :model="form" label-width="80px">
							<el-form-item label="商品名称" class="mb-0">
								<el-input v-model="form.name" size="mini" placeholder=""></el-input>
							</el-form-item>
							<el-form-item label="商品编码" class="mb-0">
								<el-input v-model="form.code" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="商品类型" class="mb-0">
								<el-select v-model="form.type" size="mini" placeholder="请选择">
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品分类" class="mb-0">
								<el-input v-model="form.category" size="mini"></el-input>
							</el-form-item>
							<el-form-item class="mb-0">
								<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
								<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</button-search>
				<el-table :data="tableData[tabIndex].list" style="width: 100%" border class="mt-3"
					@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center">
					</el-table-column>

					<el-table-column prop="title" label="商品" width="380px">
						<template slot-scope="scope">
							<div class="media">
								<img :src="scope.row.cover" class="align-self-start mr-3" style="width:60px;height:60px;">
								<div class="media-body">
									<p class="font-weight-bold">{{ scope.row.title }}</p>
									<p class="mb-1">分类: {{ scope.row.category }}</p>
									<p class="mb-0">时间: {{ scope.row.create_time }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="商品类型" align="center">
					</el-table-column>
					<el-table-column prop="sale_count" label="实际销量" align="center">
					</el-table-column>
					<el-table-column prop="order" label="商品排序" align="center">
					</el-table-column>
					<el-table-column prop="status" label="商品状态" align="center">
						<template slot-scope="scope">
							<el-button type="success" size="mini" plain @click="scope.row.ischeck = 1">
								审核通过
							</el-button>
							<el-button type="danger" size="mini" plain @click="scope.row.ischeck = 2" class="ml-0 mt-1">
								审核失败
							</el-button>

							<!-- <el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain
								@click="changeStatus(scope.row)">
								{{ scope.row.status ? "上架" : "下架" }}
							</el-button> -->
						</template>
					</el-table-column>
					<el-table-column prop="stock" label="总库存" align="center">
					</el-table-column>
					<el-table-column prop="pprice" label="价格(元)" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center" width="150px">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="primary" size="mini" plain>修改</el-button>
								<el-button type="danger" size="mini" plain @click="deleteItem(scope.$index)">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>

				<div style="height:60px"></div>
				<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white"
					style="bottom:0;left:200px;right:0;z-index:100;">
					<div style="flex:1;" class="px-2">
						<el-pagination :current-page="tableData[tabIndex].currentPage" :page-sizes="[100, 200, 300, 400]"
							:page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
						</el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue"
export default {
	name: "app",
	components: {
		buttonSearch
	},
	data () {
		return {
			tabIndex: 0,
			tabbars: [
				{ name: "审核中" },
				{ name: "出售中" },
				{ name: "已下架" },
				{ name: "库存预警" },
				{ name: "回收站" },
			],
			form: {
				name: "",
				code: "",
				type: "",
				category: ""
			},
			tableData: [],
			multipleSelection: []
		}
	},
	created () {
		this.__getData();
	},
	methods: {
		// 生成表格数据
		__getData () {
			for (let i = 0; i < this.tabbars.length; i++) {
				this.tableData.push({
					currentPage: 1,
					list: []
				});
				for (let j = 0; j < 20; j++) {
					this.tableData[i].list.push({
						id: j,
						title: "荣耀 V10全网通 标配版 4GB+64GB 魅丽红" + i + "_" + j,
						cover: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg",
						create_time: "2019-07-17 18:34:14",
						category: "手机",
						type: "普通商品",
						sale_count: 20,
						order: 100,
						status: 1,
						stock: 200,
						pprice: 1000,
						ischeck: 1,
						// 0未审核 1通过 2不通过
					});
				}
			}
		},
		// 删除当前商品
		deleteItem (index) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData[this.tabIndex].list.splice(index, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// 上下架
		changeStatus (item) {
			item.status = item.status === 1 ? 0 : 1;
		},
		handleSelectionChange (val) {
			this.multipleSelection = val;
		},
		// 加载数据
		handleClick (tab, event) {
			console.log(this.tabIndex);
			console.log(tab);
			console.log(event);
		},
		// 清空搜索条件
		clearSearch () {
			this.form = {
				name: "",
				code: "",
				type: "",
				category: ""
			};
			this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
		},
		// 搜索事件
		searchEvent (e = false) {
			console.log(e)
			// 简单搜索
			if (typeof e === "string") {
				return console.log('简单搜索', e);
			}
			// 高级搜索
			console.log("搜索事件");

		},

	}
}
</script>
<style></style>