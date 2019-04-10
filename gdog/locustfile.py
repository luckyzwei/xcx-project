
from locust import HttpLocust, TaskSet, task


class UserBehavior(TaskSet):
    headers = None

    def on_start(self):
        resp = self.client.post("/auth", json={'union_id': 'oVzypxEajF-shPHskESZWBEN31R0'})
        data = resp.json()
        self.headers = {
            'Authorization': f'Bearer {data["access_token"]}',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    @task(2)
    def user_status(self):
        self.client.get("/user/status", params={'union_id': 'oVzypxEajF-shPHskESZWBEN31R0'})

    @task(1)
    def ad_monitor(self):
        self.client.get("/groups/ad_monitor", headers=self.headers)

    @task(1)
    def welcome_msg(self):
        self.client.get("/groups/welcome_msg", headers=self.headers)


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000
