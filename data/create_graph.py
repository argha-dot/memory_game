import csv, os
from pprint import pprint

import matplotlib.pyplot as plt
import numpy as np

os.makedirs("./images", exist_ok=True)

row = {
    "Names": 0,
    "Pass Sequence": 1,
    "Hits-Training": 2,
    "Misses-Training": 3,
    "HitRate-Training": 4,
    "Hits-Auth-1": 5,
    "Misses-Auth-1": 6,
    "HitRate-Auth-1": 7,
    "passHits-Auth-1": 8,
    "passMisses-Auth-1": 9,
    "passHitRate-Auth-1": 10,
    "Hits-Auth-2": 11,
    "Misses-Auth-2": 12,
    "HitRate-Auth-2": 13,
    "passHits-Auth-2": 14,
    "passMisses-Auth-2": 15,
    "passHitRate-Auth-2": 16,
    "User ID": 17,
}


def csv_arr(file):
    with open(file, "r") as csvfile:
        reader = list(csv.reader(csvfile))

    return np.array(reader)


def get_avg(arr):

    _arr = []

    for val in arr:
        try:
            _val = float(val)
            _arr.append(_val)
        except ValueError as e:
            pass

    return sum(_arr) / len(_arr)


def get_graph_one_data(reader):

    training_hit_rates = reader[:, row["HitRate-Training"]]
    auth_one_hit_rates = reader[:, row["HitRate-Auth-1"]]
    auth_two_hit_rates = reader[:, row["HitRate-Auth-2"]]

    pprint(get_avg(training_hit_rates))
    pprint(get_avg(auth_one_hit_rates))
    pprint(get_avg(auth_two_hit_rates))

    return [
        get_avg(training_hit_rates),
        get_avg(auth_one_hit_rates),
        get_avg(auth_two_hit_rates),
    ]


def get_graph_two_data(reader):

    training_hit_rates = reader[:, row["HitRate-Training"]]
    auth_one_hit_rates = reader[:, row["HitRate-Auth-1"]]
    auth_two_hit_rates = reader[:, row["HitRate-Auth-2"]]

    return [
        (get_avg(auth_one_hit_rates) - get_avg(training_hit_rates))
        / get_avg(training_hit_rates),
        (get_avg(auth_two_hit_rates) - get_avg(training_hit_rates))
        / get_avg(training_hit_rates),
    ]


def get_graph_three_data(reader):

    training_hit_rates = reader[:, row["HitRate-Training"]]
    auth_one_hit_rates = reader[:, row["HitRate-Auth-1"]]
    auth_two_hit_rates = reader[:, row["HitRate-Auth-2"]]
    auth_one_passhit_rates = reader[:, row["passHitRate-Auth-1"]]
    auth_two_passhit_rates = reader[:, row["passHitRate-Auth-2"]]

    perf_gain_auth_one = (
        (get_avg(auth_one_hit_rates) - get_avg(training_hit_rates))
    ) / get_avg(training_hit_rates)

    perf_gain_auth_two = (
        (get_avg(auth_two_hit_rates) - get_avg(training_hit_rates))
    ) / get_avg(training_hit_rates)

    perf_gain_auth_one_pass = (
        (get_avg(auth_one_passhit_rates) - get_avg(training_hit_rates))
    ) / get_avg(training_hit_rates)

    perf_gain_auth_two_pass = (
        (get_avg(auth_two_passhit_rates) - get_avg(training_hit_rates))
    ) / get_avg(training_hit_rates)

    return [
        perf_gain_auth_one,
        perf_gain_auth_one_pass,
        perf_gain_auth_two,
        perf_gain_auth_two_pass,
    ]


def graph_one(title, image_name, data=[3, 3, 3]):
    # graph 1 [Avg hitrate in Training, Auth-1, Auth-2 ]

    figure = plt.figure()
    plt.bar(["Training", "Authentication-1", "Authentication-2"], data)
    plt.title(title)

    figure.savefig(f"images/{image_name}.png")


def graph_two(title, image_name, data=[4, 4]):
    # graph 2 [Average performance of Auth-1 and Auth-2 over Training]

    figure = plt.figure()
    plt.bar(["auth-1 hr", "auth-2 hr"], data)
    plt.ylabel("Performance Gain")
    plt.title(title)

    figure.savefig(f"images/{image_name}.png")


def graph_three(title, image_name, data=[3, 3, 3, 3]):
    # graph 3 [Average performance of Auth-1, Auth-1 Sequence, Auth-2 and Auth-2 Sequence over Training]

    figure = plt.figure()
    plt.bar(
        [
            "auth-1 hr",
            "auth-1 seq hr",
            "auth-2 hr",
            "auth-2 seq hr",
        ],
        data,
    )
    plt.ylabel("Performance Gain")
    plt.title(title)

    figure.savefig(f"images/{image_name}.png")


if __name__ == "__main__":

    game_zero = csv_arr("12-7-2021.g0.csv")
    game_one = csv_arr("12-7-2021.g1.csv")

    graph_one(
        "Game Zero Graph One", "game_zero_graph_one", data=get_graph_one_data(game_zero)
    )
    graph_two(
        "Game Zero Graph Two", "game_zero_graph_two", data=get_graph_two_data(game_zero)
    )
    graph_three(
        "Game Zero Graph Three",
        "game_zero_graph_three",
        data=get_graph_three_data(game_zero),
    )

    graph_one(
        "Game One Graph One", "game_one_graph_one", data=get_graph_one_data(game_one)
    )
    graph_two(
        "Game One Graph Two", "game_one_graph_two", data=get_graph_two_data(game_one)
    )
    graph_three(
        "Game One Graph Three",
        "game_one_graph_three",
        data=get_graph_three_data(game_one),
    )
