import random

from locust import HttpUser, between, task

PRODUCTS_URL = "/api/v1/catalogue/products"

CATEGORY_ID = "0eb74e19-25f1-4b7d-9de2-2eef07d34fb0"

PRODUCT_SLUGS = [
    "alder-sit-stand-desk",
    "cedar-compact-writing-desk",
    "compact-study-desk",
]


class CatalogueUser(HttpUser):
    wait_time = between(1, 3)

    def get_json(
        self,
        path: str,
        name: str,
        expected_keys: tuple[str, ...],
        params: dict | None = None,
    ) -> None:

        with self.client.get(
            path, params=params, name=name, catch_response=True, timeout=10
        ) as response:
            if response.status_code != 200:
                response.failure(
                    f"Expected status code 200, got {response.status_code}"
                )
                return

            try:
                data = response.json()
            except ValueError:
                response.failure("Response is not valid JSON")
                return

            if not isinstance(data, dict):
                response.failure("Response JSON is not an object")
                return

            if any(key not in data for key in expected_keys):
                response.failure(
                    f"Response JSON is missing expected keys: {expected_keys}"
                )
                return

            if "items" in expected_keys and not isinstance(data["items"], list):
                response.failure("Expected 'items' to be a list in the response JSON")
                return

    @task(8)
    def browse_products(self) -> None:
        self.get_json(
            PRODUCTS_URL,
            name="catalogue/list",
            expected_keys=("items", "total"),
            params={"page": 1, "page_size": 10},
        )

    @task(3)
    def search_products(self) -> None:
        self.get_json(
            PRODUCTS_URL,
            name="catalogue/search",
            expected_keys=("items", "total"),
            params={"search": "desk"},
        )

    @task(3)
    def browse_category(self) -> None:
        self.get_json(
            PRODUCTS_URL,
            name="catalogue/category",
            expected_keys=("items", "total"),
            params={"category_id": CATEGORY_ID},
        )

    @task(2)
    def filter_by_price(self) -> None:
        self.get_json(
            PRODUCTS_URL,
            name="catalogue/price",
            expected_keys=("items", "total"),
            params={"min_price": 0, "max_price": 10000},
        )

    @task(4)
    def view_product(self) -> None:
        product_slug = random.choice(PRODUCT_SLUGS)
        self.get_json(
            f"{PRODUCTS_URL}/{product_slug}",
            name="catalogue/detail",
            expected_keys=("product_id", "slug", "variants"),
        )
