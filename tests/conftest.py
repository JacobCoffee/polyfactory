import random

import pytest
from _pytest.monkeypatch import MonkeyPatch


@pytest.fixture(autouse=True)
def constant_length_type_args(monkeypatch: MonkeyPatch) -> None:
    """
    Make sure that the length of the type_args tuple is always 1.
    """
    monkeypatch.setattr(random, random.randint.__name__, lambda _, __: 1)
